import {
    LintError,
    SwaggerlintConfig,
    SwaggerlintRule,
    SwaggerlintRuleSetting,
    Swagger,
    OpenAPI,
} from './types';
import {isValidSwaggerVisitorName, isObject, hasKey} from './utils';

import {isSwaggerObject} from './utils/swagger';

import * as openapiUtils from './utils/openapi';

import defaultConfig from './defaultConfig';

import rules from './rules';
import walker from './walker';
import {walkOpenApi} from './walkerOpenAPI';

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

function validateInput(schema: unknown): Validated {
    if (isSwaggerObject(schema)) {
        return {
            _type: 'swagger',
            schema,
        };
    }

    if (openapiUtils.isValidOpenAPIObject(schema)) {
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
            ? walker(validated.schema, config.ignore)
            : walkOpenApi(validated.schema, config.ignore);

    if ('errors' in walkerResult) {
        return walkerResult.errors;
    }

    const {visitors} = walkerResult;

    type ValidatedRule = {
        rule: SwaggerlintRule;
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

    validatedRules.forEach(({rule, setting}) => {
        Object.keys(rule.visitor).forEach(visitorName => {
            if (!isValidSwaggerVisitorName(visitorName)) return;

            const check = rule.visitor[visitorName];

            const specificVisitor = visitors[visitorName];
            specificVisitor.forEach(
                /**
                 * TODO: note the type for `node`
                 * ts infers example object yet it can be any of the objects
                 */
                ({node, location}) => {
                    const report = (msg: string, rLocation?: string[]): void =>
                        void errors.push({
                            msg,
                            name: rule.name,
                            location: rLocation ?? location,
                        });
                    if (typeof check === 'function') {
                        /**
                         * ts manages to only infer example object here,
                         * due to the checks above function call is supposed to be safe
                         *
                         * @see https://bit.ly/2MNEii7
                         */
                        // @ts-expect-error
                        check({node, location, setting, report});
                    }
                },
            );
        });
    });

    return errors;
}
