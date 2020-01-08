import {SwaggerObject, LintError, Config, VisitorName} from './types';
import {isValidVisitorName} from './utils';
import defaultConfig from './defaultConfig';

import rules from './rules';
import walker from './walker';

export function swaggerlint(
    swagger: SwaggerObject,
    config: Config,
): LintError[] {
    const errors: LintError[] = [];

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
            const defaultSetting = defaultConfig.rules[ruleName];
            if (typeof defaultSetting !== 'undefined') {
                setting = defaultConfig.rules[ruleName];
            }
        }

        if (typeof rule.isValidSetting === 'function') {
            if (!rule.isValidSetting(setting)) {
                errors.push({
                    msg: 'Invalid rule setting',
                    name: ruleName,
                    location: [],
                });
                return;
            }
        }

        const ruleVisitorKeys = Object.keys(rule.visitor) as VisitorName[];
        ruleVisitorKeys.forEach(visitorName => {
            if (!isValidVisitorName(visitorName)) return;

            /**
             * This looks horrific
             * Yet it was my only option to tell typescript that
             * the check function argument and visitor item have the same type
             *
             * @see https://bit.ly/2MNEii7
             */
            switch (visitorName) {
                case 'SwaggerObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'InfoObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'PathsObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'DefinitionsObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ParametersDefinitionsObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ResponsesDefinitionsObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });

                        check && check({node, location, setting, report});
                    });
                case 'SecurityDefinitionsObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'SecuritySchemeObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ScopesObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'SecurityRequirementObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'TagObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ExternalDocumentationObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ContactObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'LicenseObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'PathItemObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'OperationObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ParameterObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ResponsesObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ResponseObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'SchemaObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'XMLObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'HeadersObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'HeaderObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ItemsObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
                case 'ExampleObject':
                    return visitors[visitorName].forEach(({node, location}) => {
                        const check = rule.visitor[visitorName];
                        const report = (msg: string, rLocation?: string[]) =>
                            errors.push({
                                msg,
                                name: ruleName,
                                location: rLocation ?? location,
                            });
                        check && check({node, location, setting, report});
                    });
            }
        });
    });

    return errors;
}
