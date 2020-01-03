import {Rule} from '../../types';

const name = 'no-single-allof';

const rule: Rule = {
    name,
    visitor: {
        SchemaObject: ({node, report}) => {
            if ('allOf' in node && node.allOf.length === 1) {
                report('Redundant use of "allOf" with a single item in it.');
            }
        },
    },
};

export default rule;
