import Case from 'case';
import _ from 'lodash';
import {Rule, LintError, SchemaObject} from '../../types';
import {isRef, isSchemaObjectAllOfObject} from '../../utils';

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

        function isValidCase(str: string): boolean {
            const strCase = Case.of(str);
            return validCases.has(strCase);
        }

        function checkCasingOnProperty(
            propName: string,
            defKey: string,
            properties: {[p: string]: SchemaObject},
        ): void {
            if (!isValidCase(propName)) {
                errors.push({
                    msg: `Property "${propName}" has wrong casing on "${defKey}"`,
                    name,
                });
            }

            const topLevelProp = properties[propName];

            if (isRef(topLevelProp)) return;
            if (isSchemaObjectAllOfObject(topLevelProp)) return;

            if (topLevelProp.type === 'object') {
                Object.keys(topLevelProp.properties || {}).forEach(k => {
                    if (!isValidCase(propName)) {
                        errors.push({
                            msg: `Property in path "${propName}.${k}" has wrong casing on "${defKey}"`,
                            name,
                        });
                    }
                });
            }
        }

        _.difference(
            Object.keys(definitions),
            fullConfig?.ignore?.definitions ?? [],
        ).forEach(defKey => {
            const definition = definitions[defKey];

            if (isRef(definition)) return;

            if (isSchemaObjectAllOfObject(definition)) {
                definition.allOf.forEach(subDef => {
                    if (isRef(subDef)) return;

                    const {properties} = subDef;

                    if (properties === undefined) return;

                    Object.keys(properties).forEach(propName =>
                        checkCasingOnProperty(propName, defKey, properties),
                    );
                });

                return;
            }

            if (definition.type === 'object') {
                const {properties} = definition;

                if (properties === undefined) return;

                Object.keys(properties).forEach(propName =>
                    checkCasingOnProperty(propName, defKey, properties),
                );
            }
        });

        return errors;
    },
};

export default rule;
