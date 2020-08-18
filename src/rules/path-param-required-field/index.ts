import {Swagger, OpenAPI, Report} from '../../types';
import {createRule} from '../../utils';

const name = 'path-param-required-field';
const messages = {
    requiredField: 'Parameter "{{name}}" is missing "required" property',
};

type Param = {
    node: Swagger.ParameterObject | OpenAPI.ParameterObject;
    report: Report<keyof typeof messages>;
    location: string[];
};

function ParameterObject({node, report}: Param): void {
    if (!('required' in node)) {
        report({
            messageId: 'requiredField',
            data: {
                name: node.name,
            },
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
