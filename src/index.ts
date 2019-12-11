import Case from 'case';

import {Swagger, LintError, Validators, Config} from './types';

const validators: Validators = {
    'object-prop-casing': (swagger: Swagger, configValue: string[]) => {
        const errors: LintError[] = [];
        type ValidCases = {[s: string]: null};
        const validCases: ValidCases = configValue.reduce(
            (acc: ValidCases, val) => {
                acc[val] = null;
                return acc;
            },
            {},
        );
        Object.keys(swagger.definitions).forEach(defKey => {
            const definition = swagger.definitions[defKey];
            if (definition.type === 'object') {
                if ('properties' in definition) {
                    Object.keys(definition.properties).forEach(propName => {
                        const propCase = Case.of(propName);
                        if (!(propCase in validCases)) {
                            errors.push({
                                msg: `Property "${propName}" has wrong casing on "${defKey}"`,
                                name: 'object-prop-casing',
                                source: '',
                            });
                        }
                    });
                } else {
                    // handled by 'properties-for-object-type'
                }
            }
        });
        return errors;
    },
    'properties-for-object-type': (swagger: Swagger) => {
        const errors: LintError[] = [];

        Object.keys(swagger.definitions).forEach(defKey => {
            const definition = swagger.definitions[defKey];
            if (definition.type === 'object' && !('properties' in definition)) {
                errors.push({
                    msg: `"${defKey}" has "object" type but is missing "properties"`,
                    name: 'object-type-has-properties',
                    source: '',
                });
            }
        });
        return errors;
    },
};

export function stylelintSwagger(
    swagger: Swagger,
    lintConfig: Config,
): LintError[] {
    const checkRule = (ruleName: keyof Config['rules']) => {
        const validator = validators[ruleName];
        const lintRuleOptions = lintConfig.rules[ruleName];
        if (typeof validator !== 'function') {
            console.warn(`${ruleName} is not a valid rule`);
            process.exit(1);
        }

        return validator(swagger, lintRuleOptions);
    };
    const nestedErrors = Object.keys(lintConfig.rules).map(checkRule);

    const errors = nestedErrors.reduce((acc, errs) => acc.concat(errs), []);

    return errors;
}
