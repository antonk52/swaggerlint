import {SwaggerlintRule} from '../../types';
import {isRef} from '../../utils';

const name = 'no-empty-object-type';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        SchemaObject: ({node, report}) => {
            if (isRef(node)) return;
            if (node.type !== 'object') return;

            if ('properties' in node && node.properties) {
                return;
            } else if ('allOf' in node && node.allOf) {
                return;
            } else if (
                'additionalProperties' in node &&
                node.additionalProperties
            ) {
                return;
            } else {
                report(
                    `has "object" type but is missing "properties" | "additionalProperties" | "allOf"`,
                );
            }
        },
    },
};

export default rule;
