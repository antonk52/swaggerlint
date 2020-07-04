import rule from '../';
import {Swagger, SwaggerlintConfig, OpenAPI} from '../../../types';
import {swaggerlint} from '../../../';
import _merge from 'lodash.merge';

const swaggerSample: Swagger.SwaggerObject = {
    swagger: '2.0',
    info: {
        title: 'stub',
        version: '1.0',
    },
    paths: {},
    tags: [],
};

const openapiSample: OpenAPI.OpenAPIObject = {
    openapi: '3.0.3',
    info: {
        title: 'stub',
        version: '1.0',
    },
    paths: {},
    tags: [],
};

const config: SwaggerlintConfig = {
    rules: {
        [rule.name]: true,
    },
};

describe(`rule "${rule.name}"`, () => {
    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(swaggerSample, config);

            expect(result).toEqual([]);
        });

        it('should error for a url ending with a slash', () => {
            const mod = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        type: 'string',
                                    },
                                },
                            },
                            parameters: [
                                {
                                    name: 'petId',
                                    in: 'path',
                                    required: true,
                                    type: 'string',
                                },
                            ],
                        },
                        parameters: [
                            {
                                name: 'petName',
                                in: 'query',
                                required: true,
                                type: 'string',
                            },
                        ],
                    },
                },
                parameters: [
                    {
                        name: 'petAge',
                        in: 'body',
                        required: true,
                        type: 'string',
                    },
                    {
                        name: 'petColor',
                        in: 'body',
                        description: 'color of required pet',
                        required: true,
                        type: 'string',
                    },
                    {
                        name: 'emptyDesc',
                        in: 'query',
                        description: '',
                        type: 'string',
                    },
                ],
            };
            const modConfig = _merge(mod, swaggerSample);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: '"petId" parameter is missing description.',
                    name: 'required-parameter-description',
                    location: ['paths', '/url', 'get', 'parameters', '0'],
                },
                {
                    msg: '"petName" parameter is missing description.',
                    name: 'required-parameter-description',
                    location: ['paths', '/url', 'parameters', '0'],
                },
                {
                    msg: '"petAge" parameter is missing description.',
                    name: 'required-parameter-description',
                    location: ['parameters', '0'],
                },
                {
                    msg: '"emptyDesc" parameter is missing description.',
                    name: 'required-parameter-description',
                    location: ['parameters', '2', 'description'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });

    describe('openapi', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(openapiSample, config);

            expect(result).toEqual([]);
        });

        it('should error for a url ending with a slash', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    parameters: {
                        petId: {
                            name: 'petId',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                    },
                },
            };
            const modConfig = _merge(mod, openapiSample);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: '"petId" parameter is missing description.',
                    name: rule.name,
                    location: ['components', 'parameters', 'petId'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
