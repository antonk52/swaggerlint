import {createRule} from '../../utils';

const name = 'no-single-allof';

const rule = createRule({
    name,
    meta: {
        messages: {
            msg: 'Redundant use of "allOf" with a single item in it.',
        },
    },
    swaggerVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if ('allOf' in node && node.allOf.length === 1) {
                report({messageId: 'msg', location: [...location, 'allOf']});
            }
        },
    },
    openapiVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if (node.allOf && node.allOf.length === 1) {
                report({messageId: 'msg', location: [...location, 'allOf']});
            }
        },
    },
});

export default rule;
