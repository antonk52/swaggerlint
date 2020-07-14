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

        it('should error for parameters missing "required" property', () => {
            const mod: Partial<Swagger.SwaggerObject> = {
                paths: {
                    '/url': {
                        get: {
                            parameters: [
                                {
                                    in: 'query',
                                    name: 'sample',
                                    type: 'string',
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
            const modConfig = getSwaggerObject(mod);
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
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for parameters missing "required" property', () => {
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
            const modConfig = getOpenAPIObject(mod);
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
