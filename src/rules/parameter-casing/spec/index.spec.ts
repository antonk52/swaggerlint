import rule from '../';
import {Swagger, SwaggerlintConfig, OpenAPI} from '../../../types';
import {swaggerlint} from '../../../';
import {getSwaggerObject, getOpenAPIObject} from '../../../utils/tests';

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: ['camel'],
        },
    };

    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getSwaggerObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for all non camel cased property names', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/lolkekDTO',
                                    },
                                },
                            },
                        },
                        parameters: [
                            {
                                name: 'petType',
                                in: 'query',
                                type: 'string',
                            },
                            {
                                name: 'PET_STORE',
                                in: 'query',
                                type: 'string',
                            },
                            {
                                name: 'pet-age',
                                in: 'query',
                                type: 'string',
                            },
                            {
                                name: 'pet_color',
                                in: 'query',
                                type: 'string',
                            },
                        ],
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    data: {
                        correctVersion: 'petStore',
                        name: 'PET_STORE',
                    },
                    messageId: 'casing',
                    msg:
                        'Parameter "PET_STORE" has wrong casing. Should be "petStore".',
                    name: 'parameter-casing',
                    location: ['paths', '/url', 'parameters', '1', 'name'],
                },
                {
                    data: {
                        correctVersion: 'petAge',
                        name: 'pet-age',
                    },
                    messageId: 'casing',
                    msg:
                        'Parameter "pet-age" has wrong casing. Should be "petAge".',
                    name: 'parameter-casing',
                    location: ['paths', '/url', 'parameters', '2', 'name'],
                },
                {
                    data: {
                        correctVersion: 'petColor',
                        name: 'pet_color',
                    },
                    messageId: 'casing',
                    msg:
                        'Parameter "pet_color" has wrong casing. Should be "petColor".',
                    name: 'parameter-casing',
                    location: ['paths', '/url', 'parameters', '3', 'name'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should not error for all ignored property names', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/lolkekDTO',
                                    },
                                },
                            },
                        },
                        parameters: [
                            {
                                name: 'petType',
                                in: 'query',
                                type: 'string',
                            },
                            {
                                name: 'PET_STORE',
                                in: 'query',
                                type: 'string',
                            },
                            {
                                name: 'pet-age',
                                in: 'query',
                                type: 'string',
                            },
                            {
                                name: 'pet_color',
                                in: 'query',
                                type: 'string',
                            },
                        ],
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: ['camel', {ignore: ['PET_STORE', 'pet-age']}],
                },
            });
            const expected = [
                {
                    data: {
                        correctVersion: 'petColor',
                        name: 'pet_color',
                    },
                    messageId: 'casing',
                    msg:
                        'Parameter "pet_color" has wrong casing. Should be "petColor".',
                    name: 'parameter-casing',
                    location: ['paths', '/url', 'parameters', '3', 'name'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('allows to set different casing for different parameters(in)', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/lolkekDTO',
                                    },
                                },
                            },
                        },
                        parameters: [
                            {
                                name: 'pet-type',
                                in: 'path',
                                required: true,
                                type: 'string',
                            },
                            {
                                name: 'petStore',
                                in: 'body',
                                type: 'string',
                                schema: {
                                    $ref: '',
                                },
                            },
                            {
                                name: 'pet_color',
                                in: 'query',
                                type: 'string',
                            },
                        ],
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: ['camel', {query: 'snake', path: 'kebab'}],
                },
            });

            expect(result).toEqual([]);
        });

        it('allows to ignore parameter names', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/lolkekDTO',
                                    },
                                },
                            },
                        },
                        parameters: [
                            {
                                name: 'pet-type',
                                in: 'path',
                                required: true,
                                type: 'string',
                            },
                            {
                                name: 'petStore',
                                in: 'query',
                                type: 'string',
                            },
                            {
                                name: 'pet_color',
                                in: 'query',
                                type: 'string',
                            },
                        ],
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: ['camel', {ignore: ['pet-type', 'pet_color']}],
                },
            });

            expect(result).toEqual([]);
        });
    });

    describe('openapi', () => {
        it('should NOT error for an empty openapi sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for all non camel cased property names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    parameters: {
                        foo: {
                            name: 'petType',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                        bar: {
                            name: 'PET_STORE',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                        baz: {
                            name: 'pet-age',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                        zoo: {
                            name: 'pet_color',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg:
                        'Parameter "PET_STORE" has wrong casing. Should be "petStore".',
                    data: {
                        correctVersion: 'petStore',
                        name: 'PET_STORE',
                    },
                    messageId: 'casing',
                    name: 'parameter-casing',
                    location: ['components', 'parameters', 'bar', 'name'],
                },
                {
                    msg:
                        'Parameter "pet-age" has wrong casing. Should be "petAge".',
                    data: {
                        correctVersion: 'petAge',
                        name: 'pet-age',
                    },
                    messageId: 'casing',
                    name: 'parameter-casing',
                    location: ['components', 'parameters', 'baz', 'name'],
                },
                {
                    data: {
                        correctVersion: 'petColor',
                        name: 'pet_color',
                    },
                    messageId: 'casing',
                    msg:
                        'Parameter "pet_color" has wrong casing. Should be "petColor".',
                    name: 'parameter-casing',
                    location: ['components', 'parameters', 'zoo', 'name'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should not error for all ignored property names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    parameters: {
                        foo: {
                            name: 'petType',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                        bar: {
                            name: 'PET_STORE',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                        baz: {
                            name: 'pet-age',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                        zoo: {
                            name: 'pet_color',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: ['camel', {ignore: ['PET_STORE', 'pet-age']}],
                },
            });
            const expected = [
                {
                    msg:
                        'Parameter "pet_color" has wrong casing. Should be "petColor".',
                    data: {
                        correctVersion: 'petColor',
                        name: 'pet_color',
                    },
                    messageId: 'casing',
                    name: 'parameter-casing',
                    location: ['components', 'parameters', 'zoo', 'name'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('allows to set different casing for different parameters(in)', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    parameters: {
                        foo: {
                            name: 'pet-type',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        bar: {
                            name: 'petStore',
                            in: 'cookie',
                            schema: {
                                type: 'string',
                            },
                        },
                        baz: {
                            name: 'pet_color',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: ['camel', {query: 'snake', path: 'kebab'}],
                },
            });

            expect(result).toEqual([]);
        });

        it('allows to ignore parameter names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    parameters: {
                        foo: {
                            name: 'pet-type',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        bar: {
                            name: 'petStore',
                            in: 'cookie',
                            schema: {
                                type: 'string',
                            },
                        },
                        baz: {
                            name: 'pet_color',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: ['camel', {ignore: ['pet-type', 'pet_color']}],
                },
            });

            expect(result).toEqual([]);
        });
    });
});
