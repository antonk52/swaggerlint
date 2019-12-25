import {Rule, LintError, PathItemObject, PathsObject} from '../../types';
import {isRef} from '../../utils';

const name = 'path-param-required-field';

const methods: ['get', 'post', 'put', 'delete', 'options', 'trace'] = [
    'get',
    'post',
    'put',
    'delete',
    'options',
    'trace',
];

const rule: Rule = {
    name,
    check: swagger => {
        const errors: LintError[] = [];

        Object.keys(swagger.paths).forEach((pathName: keyof PathsObject) => {
            const path: PathItemObject = swagger.paths[pathName];
            if (isRef(path)) return;

            if (path.parameters) {
                path.parameters.forEach(param => {
                    if (isRef(param)) return;

                    if (typeof param.required !== 'boolean') {
                        errors.push({
                            name,
                            msg: `required is not set for path "${pathName}".parameters`,
                        });
                    }
                });
            }
            methods.forEach(method => {
                const operation = path[method];
                if (operation === undefined) return;

                const {parameters} = operation;
                if (parameters === undefined) return;

                parameters.forEach(param => {
                    if (isRef(param)) return;

                    if (typeof param.required !== 'boolean') {
                        errors.push({
                            name,
                            msg: `required is not set for path "${pathName}" in "${method}" in "${param.name}"`,
                        });
                    }
                });
            });
        });

        return errors;
    },
};

export default rule;
