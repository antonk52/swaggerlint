import _ from 'lodash';
import {Rule, LintError} from '@/types';
import {isRef, isSchemaObjectAllOfObject} from '@/utils';

const name = 'properties-for-object-type';

const rule: Rule = {
    name,
    check: (swagger, __, fullConfig) => {
        const errors: LintError[] = [];
        const {definitions = {}} = swagger;

        _.difference(
            Object.keys(definitions),
            fullConfig?.ignore?.definitions ?? [],
        ).forEach(defKey => {
            const definition = definitions[defKey];

            if (isRef(definition)) return;

            if (isSchemaObjectAllOfObject(definition)) return;

            if (definition.type === 'object') {
                const {properties} = definition;
                if (properties === undefined) {
                    errors.push({
                        msg: `"${defKey}" has "object" type but is missing "properties"`,
                        name,
                    });
                } else {
                    Object.keys(properties).forEach(key => {
                        const topLevelProp = properties[key];
                        if (isRef(topLevelProp)) return;

                        if (
                            topLevelProp.type === 'object' &&
                            !('properties' in topLevelProp)
                        ) {
                            errors.push({
                                msg: `Path "${defKey}.${key}" is marked as "object" type but is missing "properties"`,
                                name,
                            });
                        }
                    });
                }
            }
        });
        return errors;
    },
};

export default rule;
