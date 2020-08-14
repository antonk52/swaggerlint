import rule from '../';
import {Swagger, SwaggerlintConfig, OpenAPI} from '../../../types';
import {swaggerlint} from '../../../';
import {getSwaggerObject, getOpenAPIObject} from '../../../utils/tests';

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: true,
        },
    };

    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getSwaggerObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a SchemaObject with "allOf" property containing a single item', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/Example',
                                    },
                                },
                            },
                        },
                    },
                },
                definitions: {
                    Example: {
                        type: 'object',
                        allOf: [
                            {
                                type: 'object',
                                properties: {
                                    prop: {type: 'string'},
                                    anotherProp: {type: 'string'},
                                },
                            },
                        ],
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = ['definitions', 'Example', 'allOf'];
            const expected = [
                {
                    messageId: 'msg',
                    msg: 'Redundant use of "allOf" with a single item in it.',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should NOT error for a SchemaObject with "allOf" property containing multiple items', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/Example',
                                    },
                                },
                            },
                        },
                    },
                },
                definitions: {
                    Example: {
                        type: 'object',
                        allOf: [
                            {
                                type: 'object',
                                properties: {
                                    prop: {type: 'string'},
                                    anotherProp: {type: 'string'},
                                },
                            },
                            {
                                type: 'object',
                            },
                        ],
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);

            expect(result).toEqual([]);
        });
    });

    describe('OpenAPI', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a SchemaObject with "allOf" property containing a single item', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/Example',
                                    },
                                },
                            },
                        },
                    },
                },
                components: {
                    schemas: {
                        Example: {
                            type: 'object',
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        prop: {type: 'string'},
                                        anotherProp: {type: 'string'},
                                    },
                                },
                            ],
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = ['components', 'schemas', 'Example', 'allOf'];
            const expected = [
                {
                    msg: 'Redundant use of "allOf" with a single item in it.',
                    messageId: 'msg',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should NOT error for a SchemaObject with "allOf" property containing multiple items', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                paths: {
                    '/url': {
                        get: {
                            responses: {
                                default: {
                                    description: 'default response',
                                    schema: {
                                        $ref: '#/definitions/Example',
                                    },
                                },
                            },
                        },
                    },
                },
                definitions: {
                    Example: {
                        type: 'object',
                        allOf: [
                            {
                                type: 'object',
                                properties: {
                                    prop: {type: 'string'},
                                    anotherProp: {type: 'string'},
                                },
                            },
                            {
                                type: 'object',
                            },
                        ],
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);

            expect(result).toEqual([]);
        });
    });
});
