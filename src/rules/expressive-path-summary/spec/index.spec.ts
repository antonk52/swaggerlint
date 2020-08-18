import rule from '../';
import {RuleTester} from '../../../';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [],
        invalid: [
            {
                it: 'should error for missing and poor path summaries',
                schema: {
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
                },
                errors: [
                    {
                        location: ['paths', '/some/api/path', 'get', 'summary'],
                        msg:
                            'Every path summary should contain at least 2 words. This has "upload-image"',
                        messageId: 'nonExpressive',
                        data: {
                            summary: 'upload-image',
                        },
                    },
                    {
                        location: ['paths', '/some/api/path', 'post'],
                        msg: 'Every path has to have a summary.',
                        messageId: 'noSummary',
                    },
                    {
                        location: [
                            'paths',
                            '/some/api/path',
                            'delete',
                            'summary',
                        ],
                        msg:
                            'Every path summary should contain at least 2 words. This has ""',
                        messageId: 'nonExpressive',
                        data: {
                            summary: '',
                        },
                    },
                ],
            },
        ],
    },
    openapi: {
        valid: [],
        invalid: [
            {
                it: 'should error for missing and poor path summaries',
                schema: {
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
                },
                errors: [
                    {
                        location: ['paths', '/some/api/path', 'get', 'summary'],
                        msg:
                            'Every path summary should contain at least 2 words. This has "upload-image"',
                        messageId: 'nonExpressive',
                        data: {
                            summary: 'upload-image',
                        },
                    },
                    {
                        location: ['paths', '/some/api/path', 'post'],
                        msg: 'Every path has to have a summary.',
                        messageId: 'noSummary',
                    },
                    {
                        location: [
                            'paths',
                            '/some/api/path',
                            'delete',
                            'summary',
                        ],
                        msg:
                            'Every path summary should contain at least 2 words. This has ""',
                        messageId: 'nonExpressive',
                        data: {
                            summary: '',
                        },
                    },
                ],
            },
        ],
    },
});
