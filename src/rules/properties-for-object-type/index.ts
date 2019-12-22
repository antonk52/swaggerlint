import _ from 'lodash';
import {Rule, LintError} from '@/types';

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
            if (definition.type === 'object') {
                if (!('properties' in definition)) {
                    errors.push({
                        msg: `"${defKey}" has "object" type but is missing "properties"`,
                        name,
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
