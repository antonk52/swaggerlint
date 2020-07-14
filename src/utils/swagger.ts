import {Swagger} from '../types';
import {oldHttpMethods, isObject, hasKey} from './common';

export const httpMethods = oldHttpMethods;

export function isRef(
    arg: Record<string, unknown>,
): arg is Swagger.ReferenceObject {
    return typeof arg.$ref === 'string';
}

export function isInfoObject(arg: unknown): arg is Swagger.InfoObject {
    return (
        isObject(arg) &&
        hasKey('title', arg) &&
        hasKey('version', arg) &&
        typeof arg.title === 'string' &&
        typeof arg.version === 'string'
    );
}

export function isSwaggerObject(arg: unknown): arg is Swagger.SwaggerObject {
    return (
        isObject(arg) &&
        hasKey('swagger', arg) &&
        arg.swagger === '2.0' &&
        hasKey('info', arg) &&
        hasKey('paths', arg) &&
        isObject(arg.paths) &&
        isInfoObject(arg.info)
    );
}
