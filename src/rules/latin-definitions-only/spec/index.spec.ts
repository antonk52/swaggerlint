import rule from '../';
import {RuleTester} from '../../../';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [
            {
                it: 'should NOT error for an empty swagger sample',
                schema: {
                    definitions: {
                        foo: {},
                        Foo: {},
                        FOO: {},
                    },
                },
            },
            {
                it: 'should not error for ignored definitions',
                schema: {
                    definitions: {
                        valid: {
                            type: 'object',
                        },
                        'invalid-obj': {
                            type: 'object',
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: true,
                    },
                    ignore: {
                        definitions: ['invalid-obj'],
                    },
                },
            },
        ],
        invalid: [
            {
                it: 'should error for all non latin named definitions',
                schema: {
                    definitions: {
                        valid: {
                            type: 'object',
                        },
                        'invalid-obj': {
                            type: 'object',
                        },
                    },
                },
                errors: [
                    {
                        data: {
                            name: 'invalid-obj',
                        },
                        messageId: 'msg',
                        msg:
                            'Definition name "invalid-obj" contains non latin characters.',
                        name: rule.name,
                        location: ['definitions', 'invalid-obj'],
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
            {
                it: 'should not error for ignored definitions',
                schema: {
                    components: {
                        schemas: {
                            valid: {
                                type: 'object',
                            },
                            'invalid-obj': {
                                type: 'object',
                            },
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: true,
                    },
                    ignore: {
                        components: {
                            schemas: ['invalid-obj'],
                        },
                    },
                },
            },
        ],
        invalid: [
            {
                it: 'should error for all non latin named definitions',
                schema: {
                    components: {
                        schemas: {
                            valid: {
                                type: 'object',
                            },
                            'invalid-obj': {
                                type: 'object',
                            },
                        },
                    },
                },
                errors: [
                    {
                        data: {
                            name: 'invalid-obj',
                        },
                        messageId: 'msg',
                        msg:
                            'Definition name "invalid-obj" contains non latin characters.',
                        name: rule.name,
                        location: ['components', 'schemas', 'invalid-obj'],
                    },
                ],
            },
        ],
    },
});
