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
                it: 'should error for a url ending with a slash',
                schema: {
                    paths: {
                        '/url/': {
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
                        '/correct-url': {
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
                        data: {
                            url: '/url/',
                        },
                        messageId: 'url',
                        msg: 'Url cannot end with a slash "/url/".',
                        name: 'no-trailing-slash',
                        location: ['paths', '/url/'],
                    },
                ],
            },
            {
                it: 'should error for a host url ending with a slash',
                schema: {
                    host: 'http://some.url/',
                },
                errors: [
                    {
                        data: {
                            url: 'http://some.url/',
                        },
                        msg:
                            'Host cannot end with a slash, your host url is "http://some.url/".',
                        messageId: 'host',
                        name: 'no-trailing-slash',
                        location: ['host'],
                    },
                ],
            },
        ],
    },
    openapi: {
        valid: [
            {
                it: 'should not error for an empty schema',
                schema: {},
            },
        ],
        invalid: [
            {
                it: 'should error for a url ending with a slash',
                schema: {
                    paths: {
                        '/url/': {
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
                        '/correct-url': {
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
                        data: {
                            url: '/url/',
                        },
                        messageId: 'url',
                        msg: 'Url cannot end with a slash "/url/".',
                        name: 'no-trailing-slash',
                        location: ['paths', '/url/'],
                    },
                ],
            },
            {
                it: 'should error for a server url ending with a slash',
                schema: {
                    servers: [{url: 'http://some.url/'}],
                },
                errors: [
                    {
                        data: {
                            url: 'http://some.url/',
                        },
                        msg:
                            'Server url cannot end with a slash "http://some.url/".',
                        messageId: 'server',
                        name: 'no-trailing-slash',
                        location: ['servers', '0', 'url'],
                    },
                ],
            },
        ],
    },
});
