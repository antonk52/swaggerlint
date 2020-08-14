import {Swagger, OpenAPI, Report} from '../../types';
import {createRule} from '../../utils';

const name = 'path-param-required-field';

type Param = {
    node: Swagger.ParameterObject | OpenAPI.ParameterObject;
    report: Report<'requiredField'>;
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
        messages: {
            requiredField:
                'Parameter "{{name}}" is missing "required" property',
        },
    },
    swaggerVisitor: {
        ParameterObject,
    },
    openapiVisitor: {
        ParameterObject,
    },
});

export default rule;
