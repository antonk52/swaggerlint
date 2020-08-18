import rule from '../';
import {RuleTester} from '../../../ruleTester';

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
                it: 'should error for all non camel cased property names',
                schema: {
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
                },
                errors: [
                    {
                        data: {
                            mimeType: 'lol/kek',
                        },
                        messageId: 'invalid',
                        msg: '"lol/kek" is not a valid mime type.',
                        location: ['consumes', '0'],
                    },
                    {
                        data: {
                            mimeType: 'application/typescript',
                        },
                        msg:
                            '"application/typescript" is not a valid mime type.',
                        messageId: 'invalid',
                        location: ['produces', '0'],
                    },
                    {
                        data: {
                            mimeType: 'not/valid',
                        },
                        messageId: 'invalid',
                        msg: '"not/valid" is not a valid mime type.',
                        location: ['paths', '/url', 'get', 'consumes', '0'],
                    },
                    {
                        data: {
                            mimeType: '*/*',
                        },
                        messageId: 'invalid',
                        msg: '"*/*" is not a valid mime type.',
                        location: ['paths', '/url', 'get', 'produces', '0'],
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
                it: 'should error for all non camel cased property names',
                schema: {
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
                },
                errors: [
                    {
                        data: {
                            mimeType: 'application/foo',
                        },
                        messageId: 'invalid',
                        msg: '"application/foo" is not a valid mime type.',
                        location: [
                            'components',
                            'responses',
                            'someReponse',
                            'content',
                            'application/foo',
                        ],
                    },
                ],
            },
        ],
    },
});
