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

        it('should error for empty object type', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                definitions: {
                    InvalidDTO: {
                        type: 'object',
                    },
                    ValidDTO: {
                        type: 'object',
                        additionalProperties: {
                            type: 'string',
                        },
                        properties: {
                            a: {
                                type: 'string',
                            },
                            AllOf: {
                                type: 'object',
                                allOf: [
                                    {
                                        $ref: '#/components/schemas/InvalidDTO',
                                    },
                                    {
                                        $ref: '#/components/schemas/ValidDTO',
                                    },
                                ],
                            },
                        },
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = ['definitions', 'InvalidDTO'];
            const expected = [
                {
                    msg: `has "object" type but is missing "properties" | "additionalProperties" | "allOf"`,
                    messageId: 'swagger',
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

        it('should error for empty object type', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    schemas: {
                        InvalidDTO: {
                            type: 'object',
                        },
                        ValidDTO: {
                            type: 'object',
                            additionalProperties: {
                                type: 'string',
                            },
                            properties: {
                                a: {
                                    type: 'string',
                                },
                                AllOf: {
                                    type: 'object',
                                    allOf: [
                                        {
                                            $ref:
                                                '#/components/schemas/InvalidDTO',
                                        },
                                        {
                                            $ref:
                                                '#/components/schemas/ValidDTO',
                                        },
                                    ],
                                },
                                OneOf: {
                                    type: 'object',
                                    oneOf: [
                                        {
                                            $ref:
                                                '#/components/schemas/InvalidDTO',
                                        },
                                        {
                                            $ref:
                                                '#/components/schemas/ValidDTO',
                                        },
                                    ],
                                },
                                AnyOf: {
                                    type: 'object',
                                    anyOf: [
                                        {
                                            $ref:
                                                '#/components/schemas/InvalidDTO',
                                        },
                                        {
                                            $ref:
                                                '#/components/schemas/ValidDTO',
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = ['components', 'schemas', 'InvalidDTO'];
            const expected = [
                {
                    msg: `has "object" type but is missing "properties" | "additionalProperties" | "allOf" | "anyOf" | "oneOf"`,
                    messageId: 'openapi',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
