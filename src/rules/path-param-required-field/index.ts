import {SwaggerlintRule} from '../../types';

const name = 'path-param-required-field';

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        ParameterObject: ({node, report}): void => {
            if (!('required' in node)) {
                report(
                    `Parameter with name "${node.name}" is missing "required" property`,
                );
            }
        },
    },
};

export default rule;
