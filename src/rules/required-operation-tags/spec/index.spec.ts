import rule from '../';
import {RuleTester} from '../../../';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [
            {
                it: 'should NOT error for an empty swagger sample',
                schema: {},
            },
        ],
        invalid: [
            {
                it: 'should error for a tag missing description',
                schema: {
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
                },
                errors: [
                    {
                        msg: 'Operation "get" in "/url" is missing tags.',
                        name: 'required-operation-tags',
                        data: {
                            method: 'get',
                            url: '/url',
                        },
                        location: ['paths', '/url', 'get'],
                        messageId: 'missingTags',
                    },
                ],
            },
        ],
    },
    openapi: {
        valid: [
            {
                it: 'should NOT error for an empty swagger sample',
                schema: {},
            },
        ],
        invalid: [
            {
                it: 'should error for a tag missing description',
                schema: {
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
                },
                errors: [
                    {
                        msg: 'Operation "get" in "/url" is missing tags.',
                        name: 'required-operation-tags',
                        data: {
                            method: 'get',
                            url: '/url',
                        },
                        location: ['paths', '/url', 'get'],
                        messageId: 'missingTags',
                    },
                ],
            },
        ],
    },
});
