import {Rule} from '../../types';
import {isRef} from '../../utils';

const name = 'no-empty-object-type';

const rule: Rule = {
    name,
    visitor: {
        SchemaObject: ({node, report}) => {
            if (isRef(node)) return;
            if (node.type !== 'object') return;

            if ('properties' in node && node.properties) {
                return node;
            } else if ('allOf' in node && node.allOf) {
                return node;
            } else {
                return report(
                    `has "object" type but is missing "properties" | "additionalProperties" | "allOf"`,
                );
            }
        },
    },
};

export default rule;
