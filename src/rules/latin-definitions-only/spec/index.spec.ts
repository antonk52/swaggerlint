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

        it('should error for all non latin named definitions', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                definitions: {
                    valid: {
                        type: 'object',
                    },
                    'invalid-obj': {
                        type: 'object',
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = ['definitions', 'invalid-obj'];
            const expected = [
                {
                    data: {
                        name: 'invalid-obj',
                    },
                    messageId: 'msg',
                    msg:
                        'Definition name "invalid-obj" contains non latin characters.',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should not error for ignored definitions', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                definitions: {
                    'invalid-obj': {
                        type: 'object',
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: true,
                },
                ignore: {
                    definitions: ['invalid-obj'],
                },
            });
            const expected = [] as [];

            expect(result).toEqual(expected);
        });
    });

    describe('openAPI', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for all non latin named definitions', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    schemas: {
                        valid: {
                            type: 'object',
                        },
                        'invalid-obj': {
                            type: 'object',
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = ['components', 'schemas', 'invalid-obj'];
            const expected = [
                {
                    data: {
                        name: 'invalid-obj',
                    },
                    messageId: 'msg',
                    msg:
                        'Definition name "invalid-obj" contains non latin characters.',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should not error for ignored definitions', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    schemas: {
                        valid: {
                            type: 'object',
                        },
                        'invalid-obj': {
                            type: 'object',
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: true,
                },
                ignore: {
                    components: {
                        schemas: ['invalid-obj'],
                    },
                },
            });
            const expected = [] as [];

            expect(result).toEqual(expected);
        });

        it('should not error for empty components object', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {},
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);

            expect(result).toEqual([]);
        });
    });
});
