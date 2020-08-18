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
                it: 'errors for "allOf" property containing a single item',
                schema: {
                    paths: {
                        '/url': {
                            get: {
                                responses: {
                                    default: {
                                        description: 'default response',
                                        schema: {
                                            type: 'string',
                                            enum: ['foo', 'bar'],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    definitions: {
                        Example: {
                            type: 'string',
                            enum: ['foo', 'bar'],
                        },
                    },
                },
                errors: [
                    {
                        msg:
                            'Inline enums are not allowed. Move this SchemaObject to DefinitionsObject',
                        name: rule.name,
                        messageId: 'swagger',
                        location: [
                            'paths',
                            '/url',
                            'get',
                            'responses',
                            'default',
                            'schema',
                        ],
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
                it: 'errors for "allOf" property containing a single item',
                schema: {
                    paths: {
                        '/url': {
                            get: {
                                responses: {
                                    '200': {
                                        content: {
                                            'application/json': {
                                                schema: {
                                                    type: 'string',
                                                    enum: ['foo', 'bar'],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    components: {
                        schemas: {
                            Example: {
                                type: 'string',
                                enum: ['foo', 'bar'],
                            },
                        },
                    },
                },
                errors: [
                    {
                        msg:
                            'Inline enums are not allowed. Move this SchemaObject to ComponentsObject',
                        name: rule.name,
                        messageId: 'openapi',
                        location: [
                            'paths',
                            '/url',
                            'get',
                            'responses',
                            '200',
                            'content',
                            'application/json',
                            'schema',
                        ],
                    },
                ],
            },
        ],
    },
});
