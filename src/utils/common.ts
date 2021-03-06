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

export function omit<T, S extends string>(src: T, fields: S[]): Omit<T, S> {
    const toOmit = new Set<string>(fields);

    return Object.keys(src).reduce((acc, key) => {
        if (toOmit.has(key)) return acc;

        // @ts-expect-error: shallow copying an object
        acc[key] = src[key];

        return acc;
    }, {} as Omit<T, S>);
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
