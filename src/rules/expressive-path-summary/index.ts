import {createRule} from '../../utils';
import {RuleVisitorFunction, Swagger, OpenAPI} from '../../types';

const name = 'expressive-path-summary';
const messages = {
    noSummary: 'Every path has to have a summary.',
    nonExpressive: `Every path summary should contain at least 2 words. This has "{{summary}}"`,
};
const operationObjectValidator: RuleVisitorFunction<
    OpenAPI.OperationObject | Swagger.OperationObject,
    keyof typeof messages
> = ({node, report, location}) => {
    const {summary} = node;
    if (typeof summary === 'string') {
        if (summary.split(' ').length < 2) {
            report({
                messageId: 'nonExpressive',
                data: {
                    summary,
                },
                location: [...location, 'summary'],
            });
        }
    } else {
        report({messageId: 'noSummary'});
    }
};
const rule = createRule({
    name,
    meta: {
        messages,
    },
    swaggerVisitor: {
        OperationObject: operationObjectValidator,
    },
    openapiVisitor: {
        OperationObject: operationObjectValidator,
    },
});

export default rule;
