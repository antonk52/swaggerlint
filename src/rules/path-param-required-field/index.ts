import {Rule} from '../../types';
import {isRef} from '../../utils';

const name = 'path-param-required-field';

const rule: Rule = {
    name,
    visitor: {
        ParameterObject: ({node, report}) => {
            if (!('required' in node)) {
                report(
                    `Parameter with name "${node.name}" is missing "required" property`,
                );
            }
        },
        PathItemObject: ({node, report}) => {
            const params = node.parameters;
            if (!params) return;
            params.forEach(param => {
                if (isRef(param)) return;

                if (!('required' in param)) {
                    report(
                        `Parameter with name "${param.name}" is missing "required" property`,
                    );
                }
            });
        },
    },
};

export default rule;
