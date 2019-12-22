import Case from 'case';
import _ from 'lodash';
import {Rule, LintError} from '@/types';

const name = 'object-prop-casing';

const validCasesSets = {
    camel: new Set(['camel', 'lower']), // someName
    snake: new Set(['snake', 'lower']), // some_name
    pascal: new Set(['pascal']), // SomeName
    constant: new Set(['constant']), // SOME_NAME
};

function isValidRuleOption(name: string): name is keyof typeof validCasesSets {
    return name in validCasesSets;
}

const rule: Rule = {
    name,
    check: (swagger, ruleValue, fullConfig) => {
        const errors: LintError[] = [];

        const [rValue] = ruleValue;
        if (!isValidRuleOption(rValue)) {
            return [
                {
                    name,
                    msg: `"${rValue}" is not a valid options for "${name}" rule.`,
                },
            ];
        }
        const validCases: Set<string> = validCasesSets[rValue] || null;

        const {definitions = {}} = swagger;

        _.difference(
            Object.keys(definitions),
            fullConfig?.ignore?.definitions ?? [],
        ).forEach(defKey => {
            const definition = definitions[defKey];
            if (definition.type === 'object') {
                if ('properties' in definition) {
                    Object.keys(definition.properties).forEach(propName => {
                        const propCase = Case.of(propName);
                        if (!validCases.has(propCase)) {
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
                                    if (!validCases.has(propCase)) {
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
