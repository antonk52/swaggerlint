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

const openapiSample: OpenAPI.OpenAPIObject = {
    openapi: '3.0.3',
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

const mod = {
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
            },
        },
    },
};

describe(`rule "${rule.name}"`, () => {
    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(swaggerSample, config);

            expect(result).toEqual([]);
        });

        it('should error for a tag missing description', () => {
            const schema = _merge(mod, swaggerSample);
            const result = swaggerlint(schema, config);
            const expected = [
                {
                    msg: 'Operation "get" in "/url" is missing tags.',
                    name: 'required-operation-tags',
                    location: ['paths', '/url', 'get'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
    describe('openapi', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(swaggerSample, config);

            expect(result).toEqual([]);
        });

        it('should error for a tag missing description', () => {
            const schema = _merge(mod, openapiSample);
            const result = swaggerlint(schema, config);
            const expected = [
                {
                    msg: 'Operation "get" in "/url" is missing tags.',
                    name: 'required-operation-tags',
                    location: ['paths', '/url', 'get'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
