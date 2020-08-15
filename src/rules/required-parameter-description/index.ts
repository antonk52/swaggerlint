import {Swagger, OpenAPI, Report} from '../../types';
import {createRule} from '../../utils';

const name = 'required-parameter-description';
const messages = {
    missingDesc: '"{{name}}" parameter is missing description.',
};

type Param = {
    node: Swagger.ParameterObject | OpenAPI.ParameterObject;
    report: Report<keyof typeof messages>;
    location: string[];
};

function ParameterObject({node, report, location}: Param): void {
    if (!('description' in node)) {
        report({
            messageId: 'missingDesc',
            data: {
                name: node.name,
            },
        });
    } else if (typeof node.description === 'string' && !node.description) {
        report({
            messageId: 'missingDesc',
            data: {
                name: node.name,
            },
            location: [...location, 'description'],
        });
    }
}

const rule = createRule({
    name,
    meta: {
        messages,
    },
    swaggerVisitor: {
        ParameterObject,
    },
    openapiVisitor: {
        ParameterObject,
    },
});

export default rule;
