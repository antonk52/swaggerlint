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
                it: 'should error for absent ignore option',
                schema: {
                    definitions: {
                        valid: {
                            type: 'object',
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: ['foo', {}],
                        'expressive-path-summary': true,
                    },
                },
                errors: [
                    {
                        msg:
                            "Should have required property 'ignore', got object",
                        name: rule.name,
                        location: [],
                    },
                ],
            },
            {
                it: 'should error for all non single char config options',
                schema: {
                    definitions: {
                        valid: {
                            type: 'object',
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: ['foo', {ignore: ['', '12']}],
                        'expressive-path-summary': true,
                    },
                },
                errors: [
                    {
                        msg: 'Invalid rule setting.',
                        name: rule.name,
                        location: [],
                    },
                    {
                        msg: 'Invalid rule setting.',
                        name: rule.name,
                        location: [],
                    },
                ],
            },
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
            {
                it: 'should error for non latin & non ignored definitoins',
                schema: {
                    definitions: {
                        valid: {
                            type: 'object',
                        },
                        '^invalid^': {
                            type: 'object',
                        },
                        '&invalid&': {
                            type: 'object',
                        },
                        $invalid$: {
                            type: 'object',
                        },
                        '«invalid»': {
                            type: 'object',
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: ['', {ignore: ['$', '«', '»']}],
                    },
                },
                errors: [
                    {
                        name: 'latin-definitions-only',
                        msg:
                            'Definition name "^invalid^" contains non latin characters.',
                        messageId: 'msg',
                        location: ['definitions', '^invalid^'],
                    },
                    {
                        name: 'latin-definitions-only',
                        msg:
                            'Definition name "&invalid&" contains non latin characters.',
                        messageId: 'msg',
                        location: ['definitions', '&invalid&'],
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
            {
                it: 'should not error for ignored characters',
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
                        [rule.name]: ['', {ignore: ['-']}],
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
            {
                it: 'should error for non non ignored characters',
                schema: {
                    components: {
                        schemas: {
                            valid: {
                                type: 'object',
                            },
                            $ignored$: {
                                type: 'object',
                            },
                            '^invalid^': {
                                type: 'object',
                            },
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: ['', {ignore: ['$']}],
                    },
                },
                errors: [
                    {
                        data: {
                            name: '^invalid^',
                        },
                        messageId: 'msg',
                        msg:
                            'Definition name "^invalid^" contains non latin characters.',
                        name: rule.name,
                        location: ['components', 'schemas', '^invalid^'],
                    },
                ],
            },
        ],
    },
});
