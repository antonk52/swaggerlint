import {Swagger, OpenAPI, Report} from '../../types';
import {createRule} from '../../utils';

const name = 'required-tag-description';
const messages = {
    missingDesc: 'Tag "{{name}}" is missing description.',
};

type Param = {
    node: Swagger.TagObject | OpenAPI.TagObject;
    report: Report<keyof typeof messages>;
    location: string[];
};

function TagObject({node, report, location}: Param): void {
    if (!('description' in node)) {
        report({
            messageId: 'missingDesc',
            data: {
                name: node.name,
            },
        });
        return;
    }
    if (!node.description) {
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
        TagObject,
    },
    openapiVisitor: {
        TagObject,
    },
});

export default rule;
