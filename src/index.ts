import Case from 'case';
import _ from 'lodash';

import {Swagger, LintError, Validators, Config} from './types';

const validators: Validators = {
    'object-prop-casing': (
        swagger: Swagger,
        configValue: string[],
        fullConfig,
    ) => {
        const errors: LintError[] = [];
        type ValidCases = {[s: string]: null};
        const validCases: ValidCases = configValue.reduce(
            (acc: ValidCases, val) => {
                acc[val] = null;
                return acc;
            },
            {},
        );
        _.difference(
            Object.keys(swagger.definitions),
            fullConfig?.ignore?.definitions ?? [],
        ).forEach(defKey => {
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
                        const topLevelProp = definition.properties[propName];
                        // TODO dig deeper with a stack
                        if (topLevelProp.type === 'object') {
                            Object.keys(topLevelProp.properties || {}).forEach(
                                k => {
                                    const propCase = Case.of(propName);
                                    if (!(propCase in validCases)) {
                                        errors.push({
                                            msg: `Property in path "${propName}.${k}" has wrong casing on "${defKey}"`,
                                            name: 'object-prop-casing',
                                            source: '',
                                        });
                                    }
                                },
                            );
                        }
                    });
                } else {
                    // handled by 'properties-for-object-type'
                }
            }
        });
        return errors;
    },
    'properties-for-object-type': (swagger: Swagger, __, fullConfig) => {
        const errors: LintError[] = [];

        _.difference(
            Object.keys(swagger.definitions),
            fullConfig?.ignore?.definitions ?? [],
        ).forEach(defKey => {
            const definition = swagger.definitions[defKey];
            if (definition.type === 'object') {
                if (!('properties' in definition)) {
                    errors.push({
                        msg: `"${defKey}" has "object" type but is missing "properties"`,
                        name: 'object-type-has-properties',
                        source: '',
                    });
                } else {
                    Object.keys(definition.properties).forEach(key => {
                        const topLevelProp = definition.properties[key];
                        if (
                            topLevelProp.type === 'object' &&
                            !('properties' in topLevelProp)
                        ) {
                            errors.push({
                                msg: `Path "${defKey}.${key}" is marked as "object" type but is missing "properties"`,
                                name: 'object-type-has-properties',
                                source: '',
                            });
                        }
                    });
                }
            }
        });
        return errors;
    },
};

export function swaggerlint(swagger: Swagger, lintConfig: Config): LintError[] {
    const checkRule = (ruleName: keyof Config['rules']) => {
        const validator = validators[ruleName];
        const lintRuleOptions = lintConfig.rules[ruleName];
        if (typeof validator !== 'function') {
            console.warn(`${ruleName} is not a valid rule`);
            process.exit(1);
        }

        return validator(swagger, lintRuleOptions, lintConfig);
    };
    const nestedErrors = Object.keys(lintConfig.rules).map(checkRule);

    const errors = nestedErrors.reduce((acc, errs) => acc.concat(errs), []);

    return errors;
}
