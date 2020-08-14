import {Swagger, OpenAPI, Report} from '../../types';
import {createRule} from '../../utils';

const name = 'required-operation-tags';

type Param = {
    node: Swagger.OperationObject | OpenAPI.OperationObject;
    report: Report<'missingTags'>;
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
    meta: {
        messages: {
            missingTags: 'Operation "{{method}}" in "{{url}}" is missing tags.',
        },
    },
    swaggerVisitor: {
        OperationObject,
    },
    openapiVisitor: {
        OperationObject,
    },
});

export default rule;
