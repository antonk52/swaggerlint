import {SwaggerlintRule, Swagger, OpenAPI, Report} from '../../types';

const name = 'required-parameter-description';

type Param = {
    node: Swagger.ParameterObject | OpenAPI.ParameterObject;
    report: Report;
    location: string[];
};

function ParameterObject({node, report, location}: Param): void {
    if (!('description' in node)) {
        report(`"${node.name}" parameter is missing description.`);
    } else if (typeof node.description === 'string' && !node.description) {
        report(`"${node.name}" parameter is missing description.`, [
            ...location,
            'description',
        ]);
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
