import {SwaggerlintRule} from '../../types';

const name = 'no-inline-enums';

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if (node.enum && location[0] !== 'definitions') {
                report(
                    'Inline enums are not allowed. Move this SchemaObject to DefinitionsObject',
                );
            }
        },
    },
    openapiVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if (node.enum && location[0] !== 'components') {
                report(
                    'Inline enums are not allowed. Move this SchemaObject to ComponentsObject',
                );
            }
        },
    },
};

export default rule;
