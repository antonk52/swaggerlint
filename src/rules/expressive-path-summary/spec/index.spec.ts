import rule from '../';
import {Swagger, SwaggerlintConfig} from '../../../types';
import {swaggerlint} from '../../../';
import _merge from 'lodash.merge';

const swaggerSample: Swagger.SwaggerObject = {
    swagger: '2.0',
    info: {
        title: 'stub',
        version: '1.0',
    },
    paths: {
        '/some/api/path': {
            get: {
                tags: ['random'],
                summary: 'upload-image',
                description: '',
                consumes: ['multipart/form-data'],
                produces: ['application/json'],
                responses: {
                    '200': {
                        description: 'successful operation',
                        schema: {
                            $ref: '#/definitions/ApiResponse',
                        },
                    },
                },
            },
            post: {
                tags: ['random'],
                description: '',
                consumes: ['multipart/form-data'],
                produces: ['application/json'],
                responses: {
                    '200': {
                        description: 'successful operation',
                        schema: {
                            $ref: '#/definitions/ApiResponse',
                        },
                    },
                },
            },
            delete: {
                tags: ['random'],
                summary: '',
                description: '',
                consumes: ['multipart/form-data'],
                produces: ['application/json'],
                responses: {
                    '200': {
                        description: 'successful operation',
                        schema: {
                            $ref: '#/definitions/ApiResponse',
                        },
                    },
                },
            },
            patch: {
                tags: ['random'],
                summary:
                    'wonderful summary, well described the meaning of this endpoint method.',
                description: '',
                consumes: ['multipart/form-data'],
                produces: ['application/json'],
                responses: {
                    '200': {
                        description: 'successful operation',
                        schema: {
                            $ref: '#/definitions/ApiResponse',
                        },
                    },
                },
            },
        },
    },
    tags: [],
};

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: true,
        },
    };

    it('should error for missing and poor path summaries', () => {
        const result = swaggerlint(swaggerSample, config);

        const invalidSummary = {
            location: ['paths', '/some/api/path', 'get', 'summary'],
            msg:
                'Every path summary should contain at least 2 words. This has "upload-image"',
            name: rule.name,
        };
        const emptySummary = {
            location: ['paths', '/some/api/path', 'delete', 'summary'],
            msg:
                'Every path summary should contain at least 2 words. This has ""',
            name: rule.name,
        };
        const missingSummary = {
            location: ['paths', '/some/api/path', 'post'],
            msg: 'Every path has to have summary.',
            name: rule.name,
        };
        expect(result).toEqual([invalidSummary, missingSummary, emptySummary]);
    });
});
