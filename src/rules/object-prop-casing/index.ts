import Case from 'case';
import _ from 'lodash';
import {Rule, LintError} from '../../types';

const name = 'object-prop-casing';

const rule: Rule = {
    name,
    check: (swagger, ruleValue, fullConfig) => {
        const errors: LintError[] = [];

        type ValidCases = {[s: string]: null};
        const validCases: ValidCases = ruleValue.reduce(
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
                                name,
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
                                            name,
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
};

export default rule;
