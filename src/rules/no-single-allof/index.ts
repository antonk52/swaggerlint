import {SwaggerlintRule} from '../../types';

const name = 'no-single-allof';

const rule: SwaggerlintRule = {
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
