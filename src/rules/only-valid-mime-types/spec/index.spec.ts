import rule from '../';
import {Swagger, SwaggerlintConfig, OpenAPI} from '../../../types';
import {swaggerlint} from '../../../';
import {getSwaggerObject} from '../../../utils/tests';

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

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: ['camel'],
        },
    };
    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(swaggerSample, config);

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
                            consumes: ['not/valid'],
                            produces: ['*/*'],
                        },
                    },
                },
                produces: ['application/typescript'],
                consumes: ['lol/kek'],
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: '"lol/kek" is not a valid mime type.',
                    name: rule.name,
                    location: ['consumes', '0'],
                },
                {
                    msg: '"application/typescript" is not a valid mime type.',
                    name: rule.name,
                    location: ['produces', '0'],
                },
                {
                    msg: '"not/valid" is not a valid mime type.',
                    name: rule.name,
                    location: ['paths', '/url', 'get', 'consumes', '0'],
                },
                {
                    msg: '"*/*" is not a valid mime type.',
                    name: rule.name,
                    location: ['paths', '/url', 'get', 'produces', '0'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });

    describe('openAPI', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(openapiSample, config);

            expect(result).toEqual([]);
        });

        it('should error for all non camel cased property names', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
                components: {
                    responses: {
                        someReponse: {
                            content: {
                                'application/foo': {
                                    schema: {
                                        $ref: '#/components/schemas/resp',
                                    },
                                },
                            },
                        },
                    },
                },
            };
            const modConfig = {...openapiSample, ...mod};
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: '"application/foo" is not a valid mime type.',
                    name: rule.name,
                    location: [
                        'components',
                        'responses',
                        'someReponse',
                        'content',
                        'application/foo',
                    ],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
