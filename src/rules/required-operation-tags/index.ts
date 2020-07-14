import {SwaggerlintRule, Swagger, OpenAPI, Report} from '../../types';

const name = 'required-operation-tags';

type Param = {
    node: Swagger.OperationObject | OpenAPI.OperationObject;
    report: Report;
    location: string[];
};

function OperationObject({node, report, location}: Param): void {
    if (!Array.isArray(node.tags) || node.tags.length < 1) {
        const method = location[location.length - 1];
        const url = location[location.length - 2];
        report(`Operation "${method}" in "${url}" is missing tags.`);
    }
}

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        OperationObject,
    },
    openapiVisitor: {
        OperationObject,
    },
};

export default rule;
