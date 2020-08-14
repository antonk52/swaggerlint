import {Swagger, OpenAPI, Report} from '../../types';
import {createRule} from '../../utils';

const name = 'required-tag-description';

type Param = {
    node: Swagger.TagObject | OpenAPI.TagObject;
    report: Report<'missingDesc'>;
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
        messages: {
            missingDesc: 'Tag "{{name}}" is missing description.',
        },
    },
    swaggerVisitor: {
        TagObject,
    },
    openapiVisitor: {
        TagObject,
    },
});

export default rule;
