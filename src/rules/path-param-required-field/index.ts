import {SwaggerlintRule} from '../../types';

const name = 'path-param-required-field';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        ParameterObject: ({node, report}) => {
            if (!('required' in node)) {
                report(
                    `Parameter with name "${node.name}" is missing "required" property`,
                );
            }
        },
    },
};

export default rule;
