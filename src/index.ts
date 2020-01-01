import {SwaggerObject, LintError, Config, VisitorName} from './types';
import {isValidVisitorName} from './utils';

import rules from './rules';
import walker from './walker';

export function swaggerlint(
    swagger: SwaggerObject,
    lintConfig: Config,
): LintError[] {
    const errors: LintError[] = [];

    const walkerResult = walker(swagger, lintConfig.ignore);

    if ('errors' in walkerResult) {
        return walkerResult.errors;
    }

    const {visitors} = walkerResult;

    Object.keys(lintConfig.rules).forEach(ruleName => {
        const rule = rules[ruleName];
        if (!rule) {
            return errors.push({
                msg: `swaggerlint.config.js contains invalid rule "${ruleName}"`,
                name: 'swaggerlint-core',
            });
        }

        const setting = lintConfig.rules[ruleName];

        if (typeof rule.isValidSetting === 'function') {
            if (!rule.isValidSetting(setting))
                return errors.push({
                    msg: 'Invalid rule setting',
                    name: ruleName,
                });
        }

        const ruleVisitorKeys = Object.keys(rule.visitor) as VisitorName[];
        ruleVisitorKeys.forEach(visitorName => {
            if (!isValidVisitorName(visitorName)) return;

            const report = (msg: string) => errors.push({msg, name: ruleName});

            switch (visitorName) {
                case 'SwaggerObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'InfoObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'PathsObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'DefinitionsObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ParametersDefinitionsObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ResponsesDefinitionsObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'SecurityDefinitionsObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'SecuritySchemeObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ScopesObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'SecurityRequirementObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'TagObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ExternalDocumentationObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ContactObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'LicenseObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'PathItemObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'OperationObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ParameterObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ResponsesObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ResponseObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'SchemaObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'XMLObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'HeadersObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'HeaderObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ItemsObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
                case 'ExampleObject':
                    return visitors[visitorName].forEach(node => {
                        const check = rule.visitor[visitorName];
                        check && check({node, setting, report});
                    });
            }
        });

        rule;
    });

    return errors;
}
