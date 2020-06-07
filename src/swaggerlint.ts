import {LintError, SwaggerlintConfig} from './types';
import {
    isValidSwaggerVisitorName,
    isSwaggerObject,
    isObject,
    hasKey,
} from './utils';
import defaultConfig from './defaultConfig';

import rules from './rules';
import walker from './walker';

export function swaggerlint(
    swagger: unknown,
    config: SwaggerlintConfig,
): LintError[] {
    const errors: LintError[] = [];

    if (!isSwaggerObject(swagger)) {
        let msg = `Swaggerlint only supports Swagger/OpenAPI v2.0;`;

        if (
            isObject(swagger) &&
            hasKey('openapi', swagger) &&
            typeof swagger.openapi === 'string'
        ) {
            msg += ` You have supplied OpenAPI ${swagger.openapi}`;
        }

        return [
            {
                msg,
                name: 'swaggerlint-core',
                location: [],
            },
        ];
    }

    const walkerResult = walker(swagger, config.ignore);

    if ('errors' in walkerResult) {
        return walkerResult.errors;
    }

    const {visitors} = walkerResult;

    Object.keys(config.rules).forEach(ruleName => {
        const rule = rules[ruleName];
        if (!rule) {
            return errors.push({
                msg: `swaggerlint.config.js contains unknown rule "${ruleName}"`,
                name: 'swaggerlint-core',
                location: [],
            });
        }

        let setting = config.rules[ruleName];

        if (setting === false) {
            return;
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
                return;
            }
        }

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
                            name: ruleName,
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
