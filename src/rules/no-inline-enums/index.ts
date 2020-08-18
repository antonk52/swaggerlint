import {createRule} from '../../utils';

const name = 'no-inline-enums';

const rule = createRule({
    name,
    meta: {
        messages: {
            swagger:
                'Inline enums are not allowed. Move this SchemaObject to DefinitionsObject',
            openapi:
                'Inline enums are not allowed. Move this SchemaObject to ComponentsObject',
        },
    },
    swaggerVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if (node.enum && location[0] !== 'definitions') {
                report({messageId: 'swagger'});
            }
        },
    },
    openapiVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if (node.enum && location[0] !== 'components') {
                report({messageId: 'openapi'});
            }
        },
    },
});

export default rule;
