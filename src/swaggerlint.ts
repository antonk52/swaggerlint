import {
    Report,
    LintError,
    SwaggerlintConfig,
    SwaggerlintRule,
    SwaggerlintRuleSetting,
    SwaggerVisitors,
    OpenAPIVisitors,
    NodeWithLocation,
    Swagger,
    OpenAPI,
    RuleVisitorFunction,
    OpenAPITypes,
} from './types';
import {isValidSwaggerVisitorName, hasKey} from './utils';

import {isSwaggerObject} from './utils/swagger';

import * as oaUtils from './utils/openapi';

import defaultConfig from './defaultConfig';

import rules from './rules';
import * as walker from './walker';

type Validated =
    | {
          _type: 'swagger';
          schema: Swagger.SwaggerObject;
      }
    | {
          _type: 'openAPI';
          schema: OpenAPI.OpenAPIObject;
      }
    | null;

type Info =
    | {
          _type: 'swagger';
          schema: Swagger.SwaggerObject;
          visitors: SwaggerVisitors;
      }
    | {
          _type: 'openAPI';
          schema: OpenAPI.OpenAPIObject;
          visitors: OpenAPIVisitors;
      };

function validateInput(schema: unknown): Validated {
    if (isSwaggerObject(schema)) {
        return {
            _type: 'swagger',
            schema,
        };
    }

    if (oaUtils.isValidOpenAPIObject(schema)) {
        return {
            _type: 'openAPI',
            schema,
        };
    }

    return null;
}

export function swaggerlint(
    input: unknown,
    config: SwaggerlintConfig,
): LintError[] {
    const errors: LintError[] = [];
    const validated = validateInput(input);

    if (validated === null) {
        return [
            {
                msg: 'You have supplier neither OpenAPI nor Swagger schema',
                name: 'swaggerlint-core',
                location: [],
            },
        ];
    }

    const walkerResult =
        validated._type === 'swagger'
            ? walker.walkSwagger(validated.schema, config.ignore)
            : walker.walkOpenAPI(validated.schema, config.ignore || {});

    if ('errors' in walkerResult) {
        return walkerResult.errors;
    }

    const info = {
        ...validated,
        visitors: walkerResult.visitors,
    } as Info;

    type ValidatedRule = {
        rule: SwaggerlintRule<string>;
        setting: SwaggerlintRuleSetting;
    };

    const validatedRules: ValidatedRule[] = Object.keys(config.rules).reduce(
        (acc, ruleName) => {
            const rule = rules[ruleName];
            if (!rule) {
                errors.push({
                    msg: `swaggerlint.config.js contains unknown rule "${ruleName}"`,
                    name: 'swaggerlint-core',
                    location: [],
                });

                return acc;
            }

            let setting = config.rules[ruleName];

            if (setting === false) {
                return acc;
            } else if (setting === true) {
                const defaultConfigSetting = defaultConfig.rules[ruleName];
                if (typeof defaultConfigSetting !== 'undefined') {
                    setting = defaultConfigSetting;
                } else if ('defaultSetting' in rule) {
                    setting = rule.defaultSetting;
                }
            }

            if (
                'isValidSetting' in rule &&
                typeof rule.isValidSetting === 'function'
            ) {
                if (!rule.isValidSetting(setting)) {
                    errors.push({
                        msg: 'Invalid rule setting',
                        name: ruleName,
                        location: [],
                    });
                    return acc;
                }
            }

            acc.push({
                rule,
                setting,
            });

            return acc;
        },
        [] as ValidatedRule[],
    );

    if (validatedRules.length === 0) {
        errors.push({
            msg:
                'Found 0 enabled rules. Swaggerlint requires at least one rule enabled.',
            name: 'swaggerlint-core',
            location: [],
        });

        return errors;
    }

    if (info._type === 'swagger') {
        validatedRules.forEach(({rule, setting}) => {
            const {swaggerVisitor} = rule;
            if (!swaggerVisitor) return;
            Object.keys(swaggerVisitor).forEach(visitorName => {
                // TODO swagger & openapi visitor names checks
                if (!isValidSwaggerVisitorName(visitorName)) return;

                const check = swaggerVisitor[visitorName];

                const specificVisitor = info.visitors[visitorName];
                specificVisitor.forEach(
                    /**
                     * TODO: note the type for `node`
                     * ts infers example object yet it can be any of the objects
                     */
                    ({node, location}) => {
                        const report = makeReportFunc(errors, rule, location);
                        if (typeof check === 'function') {
                            /**
                             * ts manages to only infer example object here,
                             * due to the checks above function call is supposed to be safe
                             *
                             */
                            // @ts-expect-error: @see https://bit.ly/2MNEii7
                            check({node, location, setting, report, config});
                        }
                    },
                );
            });
        });
    } else {
        validatedRules.forEach(({rule, setting}) => {
            const {openapiVisitor} = rule;
            if (!openapiVisitor) return;
            Object.keys(openapiVisitor).forEach(visitorName => {
                if (!oaUtils.isValidVisitorName(visitorName)) return;

                type CurrentObject = OpenAPITypes[typeof visitorName];
                const check = openapiVisitor[
                    visitorName
                ] as RuleVisitorFunction<CurrentObject, string> | void;

                if (check === undefined) return;

                const specificVisitor = info.visitors[visitorName];
                specificVisitor.forEach(
                    ({node, location}: NodeWithLocation<CurrentObject>) => {
                        const report = makeReportFunc(errors, rule, location);

                        check({node, location, setting, report, config});
                    },
                );
            });
        });
    }

    return errors;
}

function makeReportFunc<MessageIds extends string>(
    errors: LintError[],
    rule: SwaggerlintRule<MessageIds>,
    location: string[],
): Report<MessageIds> {
    return function (arg): void {
        if (hasKey('messageId', arg) && arg.messageId) {
            const msgTemplate = rule.meta?.messages?.[arg.messageId] || '';
            // TODO: return an error for the rule if `messageId` is unknown
            /* eslint-disable indent */
            const message: string = arg.data
                ? Object.keys(arg.data).reduce((acc, key) => {
                      return acc.replace(
                          new RegExp(`{{\s*${key}\s*}}`, 'g'),
                          // @ts-expect-error: this code will not run if data is undefined.
                          arg.data[key],
                      );
                  }, msgTemplate)
                : msgTemplate;
            /* eslint-enable indent */

            const err: LintError = {
                name: rule.name,
                msg: message,
                messageId: arg.messageId,
                location: arg.location || location,
            };
            if (arg.data) err.data = arg.data;
            errors.push(err);
            return;
        }

        if (hasKey('message', arg) && arg.message) {
            const err: LintError = {
                name: rule.name,
                msg: arg.message,
                location: arg.location || location,
            };
            errors.push(err);
            return;
        }

        throw new Error(
            `Invalid data passed to report function:\n\n${JSON.stringify(
                arg,
                null,
                4,
            )}`,
        );
    };
}
