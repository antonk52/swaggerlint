import {SwaggerlintRule, Swagger, OpenAPI, Report} from '../../types';

const name = 'required-tag-description';

type Param = {
    node: Swagger.TagObject | OpenAPI.TagObject;
    report: Report;
    location: string[];
};

function TagObject({node, report, location}: Param): void {
    if (!('description' in node)) {
        report(`Tag "${node.name}" is missing description.`);
        return;
    }
    if (!node.description) {
        report(`Tag "${node.name}" is missing description.`, [
            ...location,
            'description',
        ]);
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
