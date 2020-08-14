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
                    },
                },
                definitions: {
                    lolkekDTO: {
                        type: 'object',
                        properties: {
                            'some-casing': {type: 'string'},
                            // eslint-disable-next-line
                            some_casing: {type: 'string'},
                            SOME_CASING: {type: 'string'},
                            SomeCasing: {type: 'string'},
                            someCasing: {type: 'string'},
                        },
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = ['definitions', 'lolkekDTO', 'properties'];
            const expected = [
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'some-casing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "some-casing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'some-casing'],
                },
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'some_casing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "some_casing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'some_casing'],
                },
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'SOME_CASING',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "SOME_CASING" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'SOME_CASING'],
                },
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'SomeCasing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "SomeCasing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'SomeCasing'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should not error for ignored property names', () => {
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
                    },
                },
                definitions: {
                    lolkekDTO: {
                        type: 'object',
                        properties: {
                            'some-casing': {type: 'string'},
                            SOME_CASING: {type: 'string'},
                            SomeCasing: {type: 'string'},
                        },
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: [
                        'camel',
                        {ignore: ['SOME_CASING', 'SomeCasing']},
                    ],
                },
            });
            const location = [
                'definitions',
                'lolkekDTO',
                'properties',
                'some-casing',
            ];
            const expected = [
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'some-casing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "some-casing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should NOT error for all non camel cased property names', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                definitions: {
                    lolkekDTO: {
                        type: 'object',
                        properties: {
                            prop: {type: 'string'},
                            anotherProp: {type: 'string'},
                            yetAnotherProp: {type: 'string'},
                        },
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);

            expect(result).toEqual([]);
        });
    });

    describe('openapi', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for all non camel cased property names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    schemas: {
                        lolkekDTO: {
                            type: 'object',
                            properties: {
                                'some-casing': {type: 'string'},
                                // eslint-disable-next-line
                                some_casing: {type: 'string'},
                                SOME_CASING: {type: 'string'},
                                SomeCasing: {type: 'string'},
                                someCasing: {type: 'string'},
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = [
                'components',
                'schemas',
                'lolkekDTO',
                'properties',
            ];
            const expected = [
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'some-casing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "some-casing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'some-casing'],
                },
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'some_casing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "some_casing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'some_casing'],
                },
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'SOME_CASING',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "SOME_CASING" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'SOME_CASING'],
                },
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'SomeCasing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "SomeCasing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location: [...location, 'SomeCasing'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should not error for ignored property names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    schemas: {
                        lolkekDTO: {
                            type: 'object',
                            properties: {
                                'some-casing': {type: 'string'},
                                SOME_CASING: {type: 'string'},
                                SomeCasing: {type: 'string'},
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, {
                rules: {
                    [rule.name]: [
                        'camel',
                        {ignore: ['SOME_CASING', 'SomeCasing']},
                    ],
                },
            });
            const location = [
                'components',
                'schemas',
                'lolkekDTO',
                'properties',
                'some-casing',
            ];
            const expected = [
                {
                    data: {
                        correctVersion: 'someCasing',
                        propName: 'some-casing',
                    },
                    messageId: 'casing',
                    msg:
                        'Property "some-casing" has wrong casing. Should be "someCasing".',
                    name: 'object-prop-casing',
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should NOT error for all non camel cased property names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    schemas: {
                        lolkekDTO: {
                            type: 'object',
                            properties: {
                                prop: {type: 'string'},
                                anotherProp: {type: 'string'},
                                yetAnotherProp: {type: 'string'},
                            },
                        },
                    },
                },
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);

            expect(result).toEqual([]);
        });
    });
});
