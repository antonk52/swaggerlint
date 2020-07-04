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

const config: SwaggerlintConfig = {
    rules: {
        [rule.name]: true,
    },
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

describe(`rule "${rule.name}"`, () => {
    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(swaggerSample, config);

            expect(result).toEqual([]);
        });

        it('should error for all non camel cased property names', () => {
            const mod = {
                paths: {
                    '/url': {
                        get: {
                            parameters: [
                                {
                                    in: 'query',
                                    name: 'sample',
                                    schema: {
                                        $ref: '',
                                    },
                                },
                            ],
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
            };
            const modConfig = _merge(mod, swaggerSample);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Parameter "sample" is missing "required" property',
                    name: rule.name,
                    location: ['paths', '/url', 'get', 'parameters', '0'],
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

        it('should error for all non camel cased property names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    parameters: {
                        sample: {
                            in: 'query',
                            name: 'sample',
                            schema: {
                                $ref: '',
                            },
                        },
                    },
                },
            };
            const modConfig = _merge(mod, openapiSample);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Parameter "sample" is missing "required" property',
                    name: rule.name,
                    location: ['components', 'parameters', 'sample'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
