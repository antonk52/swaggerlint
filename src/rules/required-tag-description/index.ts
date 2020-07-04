import {SwaggerlintRule, Swagger, OpenAPI, Report} from '../../types';

const name = 'required-tag-description';

type Param = {
    node: Swagger.TagObject | OpenAPI.TagObject;
    report: Report;
    location: string[];
};

function TagObject({node, report}: Param): void {
    if (!('description' in node) || !node.description) {
        report(`Tag "${node.name}" is missing description.`);
    }
}

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        TagObject,
    },
    openapiVisitor: {
        TagObject,
    },
};

export default rule;
