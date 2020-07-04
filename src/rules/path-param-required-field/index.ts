import {SwaggerlintRule, Swagger, OpenAPI, Report} from '../../types';

const name = 'path-param-required-field';

type Param = {
    node: Swagger.ParameterObject | OpenAPI.ParameterObject;
    report: Report;
    location: string[];
};

function ParameterObject({node, report}: Param): void {
    if (!('required' in node)) {
        report(`Parameter "${node.name}" is missing "required" property`);
    }
}

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        ParameterObject,
    },
    openapiVisitor: {
        ParameterObject,
    },
};

export default rule;
