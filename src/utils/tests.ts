import {Swagger, OpenAPI} from '../types';
import deepmerge from 'deepmerge';

export function getSwaggerObject(
    schema: Partial<Swagger.SwaggerObject>,
): Swagger.SwaggerObject {
    return deepmerge(
        {
            swagger: '2.0',
            info: {
                title: 'stub',
                version: '1.0',
            },
            paths: {},
            tags: [],
        },
        schema,
    );
}

export function getOpenAPIObject(
    schema: Partial<OpenAPI.OpenAPIObject>,
): OpenAPI.OpenAPIObject {
    return deepmerge(
        {
            openapi: '3.0.3',
            info: {
                title: 'stub',
                version: '1.0',
            },
            paths: {},
            tags: [],
        },
        schema,
    );
}
