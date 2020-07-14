import rule from '../';
import {Swagger, SwaggerlintConfig, OpenAPI} from '../../../types';
import {swaggerlint} from '../../../';
import {getSwaggerObject, getOpenAPIObject} from '../../../utils/tests';

const config: SwaggerlintConfig = {
    rules: {
        [rule.name]: true,
    },
};

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
            },
        },
    },
};

describe(`rule "${rule.name}"`, () => {
    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getSwaggerObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a tag missing description', () => {
            const schema = getSwaggerObject(mod);
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
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a tag missing description', () => {
            // @ts-expect-error: not necessary to recreate full object
            const oMod: Partial<OpenAPI.OpenAPIObject> = {...mod};
            const schema = getOpenAPIObject(oMod);
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
