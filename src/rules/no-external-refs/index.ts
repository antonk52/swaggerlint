import {SwaggerlintRule} from '../../types';

const name = 'no-external-refs';

const rule: SwaggerlintRule = {
    name,
    openapiVisitor: {
        ReferenceObject: ({node, report}): void => {
            if (!node.$ref.startsWith('#')) {
                report('External references are banned.');
            }
        },
    },
};

export default rule;
