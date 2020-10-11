import {Swagger, OpenAPI, Report} from '../../types';
import {createRule} from '../../utils';

const name = 'required-operation-tags';
const messages = {
    missingTags: 'Operation "{{method}}" in "{{url}}" is missing tags.',
};

type Param = {
    node: Swagger.OperationObject | OpenAPI.OperationObject;
    report: Report<keyof typeof messages>;
    location: string[];
};

function OperationObject({node, report, location}: Param): void {
    if (!Array.isArray(node.tags) || node.tags.length < 1) {
        const method = location[location.length - 1];
        const url = location[location.length - 2];
        report({
            messageId: 'missingTags',
            data: {
                method,
                url,
            },
        });
    }
}

const rule = createRule({
    name,
    docs: {
        recommended: true,
        description: 'All operations must have tags',
    },
    meta: {
        messages,
    },
    swaggerVisitor: {
        OperationObject,
    },
    openapiVisitor: {
        OperationObject,
    },
});

export default rule;
