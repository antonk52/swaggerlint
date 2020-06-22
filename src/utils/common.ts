export const oldHttpMethods = [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
] as const;

export const newerHttpMethods = [...oldHttpMethods, 'trace'] as const;

export function hasKey<K extends string>(
    key: K,
    obj: object,
): obj is {[key in K]: unknown} {
    return key in obj;
}

export function isObject(arg: unknown): arg is object {
    return typeof arg === 'object' && arg !== null && !Array.isArray(arg);
}
