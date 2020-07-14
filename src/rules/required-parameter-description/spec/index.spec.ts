import rule from '../';
import {Swagger, SwaggerlintConfig, OpenAPI} from '../../../types';
import {swaggerlint} from '../../../';
import {getSwaggerObject, getOpenAPIObject} from '../../../utils/tests';

const config: SwaggerlintConfig = {
    rules: {
        [rule.name]: true,
    },
};

describe(`rule "${rule.name}"`, () => {
    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getSwaggerObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a url ending with a slash', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
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
                parameters: {
                    petAge: {
                        name: 'petAge',
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                    petColor: {
                        name: 'petColor',
                        in: 'body',
                        description: 'color of required pet',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                    emptyDesc: {
                        name: 'emptyDesc',
                        in: 'query',
                        description: '',
                        type: 'string',
                    },
                },
            };
            const modConfig = getSwaggerObject(mod);
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
                    location: ['parameters', 'petAge'],
                },
                {
                    msg: '"emptyDesc" parameter is missing description.',
                    name: 'required-parameter-description',
                    location: ['parameters', 'emptyDesc', 'description'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });

    describe('openapi', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

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
            const modConfig = getOpenAPIObject(mod);
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
