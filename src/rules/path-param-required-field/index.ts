import {
    Rule,
    LintError,
    PathItemObject,
    PathsObject,
    ReferenceObject,
} from '@/types';

const name = 'path-param-required-field';

const methods: ['get', 'post', 'put', 'delete', 'options', 'trace'] = [
    'get',
    'post',
    'put',
    'delete',
    'options',
    'trace',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRefObj(obj: any): obj is ReferenceObject {
    return (
        typeof obj === 'object' &&
        !Array.isArray(obj) &&
        obj !== null &&
        '$ref' in obj &&
        typeof obj.$ref === 'string'
    );
}

const rule: Rule = {
    name,
    check: swagger => {
        const errors: LintError[] = [];

        Object.keys(swagger.paths).forEach((pathName: keyof PathsObject) => {
            const path: PathItemObject = swagger.paths[pathName];
            if (path.parameters) {
                path.parameters.forEach(param => {
                    if (isRefObj(param)) {
                        // TODO handle refs
                        return;
                    }
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
                console.log(operation);
                operation.parameters.forEach(param => {
                    if (isRefObj(param)) {
                        // TODO handle refs
                        return;
                    }
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
