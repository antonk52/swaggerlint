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
                                        type: 'string',
                                        enum: ['foo', 'bar'],
                                    },
                                },
                            },
                        },
                    },
                },
                definitions: {
                    Example: {
                        type: 'string',
                        enum: ['foo', 'bar'],
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = [
                'paths',
                '/url',
                'get',
                'responses',
                'default',
                'schema',
            ];
            const expected = [
                {
                    msg:
                        'Inline enums are not allowed. Move this SchemaObject to DefinitionsObject',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
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
                                '200': {
                                    content: {
                                        'application/json': {
                                            schema: {
                                                type: 'string',
                                                enum: ['foo', 'bar'],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                components: {
                    schemas: {
                        Example: {
                            type: 'string',
                            enum: ['foo', 'bar'],
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = [
                'paths',
                '/url',
                'get',
                'responses',
                '200',
                'content',
                'application/json',
                'schema',
            ];
            const expected = [
                {
                    msg:
                        'Inline enums are not allowed. Move this SchemaObject to ComponentsObject',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
