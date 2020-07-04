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

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: true,
        },
    };

    const mod = {
        tags: [
            {
                name: 'no-description',
            },
            {
                name: 'with-description',
                description: 'some description about the tag',
            },
        ],
    };

    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(swaggerSample, config);

            expect(result).toEqual([]);
        });

        it('should error for a tag missing description', () => {
            const modConfig = _merge(mod, swaggerSample);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Tag "no-description" is missing description.',
                    name: 'required-tag-description',
                    location: ['tags', '0'],
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

        it('should error for a tag missing description', () => {
            const modConfig = _merge(mod, openapiSample);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Tag "no-description" is missing description.',
                    name: 'required-tag-description',
                    location: ['tags', '0'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
