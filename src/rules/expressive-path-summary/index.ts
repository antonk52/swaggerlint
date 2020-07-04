import {
    SwaggerlintRule,
    RuleVisitorFunction,
    Swagger,
    OpenAPI,
} from '../../types';

const name = 'expressive-path-summary';
const operationObjectValidator: RuleVisitorFunction<
    OpenAPI.OperationObject | Swagger.OperationObject
> = ({node, report, location}) => {
    const {summary} = node;
    if (typeof summary === 'string') {
        if (summary.split(' ').length < 2) {
            report(
                `Every path summary should contain at least 2 words. This has "${summary}"`,
                [...location, 'summary'],
            );
        }
    } else {
        report('Every path has to have a summary.');
    }
};
const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        OperationObject: operationObjectValidator,
    },
    openapiVisitor: {
        OperationObject: operationObjectValidator,
    },
};

export default rule;
