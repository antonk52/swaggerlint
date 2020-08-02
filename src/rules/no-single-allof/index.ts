import {SwaggerlintRule} from '../../types';

const name = 'no-single-allof';
const msg = 'Redundant use of "allOf" with a single item in it.';

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if ('allOf' in node && node.allOf.length === 1) {
                report(msg, [...location, 'allOf']);
            }
        },
    },
    openapiVisitor: {
        SchemaObject: ({node, report, location}): void => {
            if (node.allOf && node.allOf.length === 1) {
                report(msg, [...location, 'allOf']);
            }
        },
    },
};

export default rule;
