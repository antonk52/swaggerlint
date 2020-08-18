import rule from '../';
import {RuleTester} from '../../..';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [
            {
                it: 'should not error for an empty swagger sample',
                schema: {},
            },
            {
                it: 'should not error for the "allOf" with multiple items',
                schema: {
                    paths: {
                        '/url': {
                            get: {
                                responses: {
                                    default: {
                                        description: 'default response',
                                        schema: {
                                            $ref: '#/definitions/Example',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    definitions: {
                        Example: {
                            type: 'object',
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        prop: {type: 'string'},
                                        anotherProp: {type: 'string'},
                                    },
                                },
                                {
                                    type: 'object',
                                },
                            ],
                        },
                    },
                },
            },
        ],
        invalid: [
            {
                it: 'should error for "allOf" with a single item',
                schema: {
                    paths: {
                        '/url': {
                            get: {
                                responses: {
                                    default: {
                                        description: 'default response',
                                        schema: {
                                            $ref: '#/definitions/Example',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    definitions: {
                        Example: {
                            type: 'object',
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        prop: {type: 'string'},
                                        anotherProp: {type: 'string'},
                                    },
                                },
                            ],
                        },
                    },
                },
                errors: [
                    {
                        messageId: 'msg',
                        msg:
                            'Redundant use of "allOf" with a single item in it.',
                        name: rule.name,
                        location: ['definitions', 'Example', 'allOf'],
                    },
                ],
            },
        ],
    },
    openapi: {
        valid: [
            {
                it: 'does not error for an empty swagger sample',
                schema: {},
            },
            {
                it: 'does not error for "allOf" property with multiple items',
                schema: {
                    paths: {
                        '/url': {
                            get: {
                                responses: {
                                    default: {
                                        description: 'default response',
                                        schema: {
                                            $ref: '#/definitions/Example',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    definitions: {
                        Example: {
                            type: 'object',
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        prop: {type: 'string'},
                                        anotherProp: {type: 'string'},
                                    },
                                },
                                {
                                    type: 'object',
                                },
                            ],
                        },
                    },
                },
            },
        ],
        invalid: [
            {
                it: 'should error for "allOf" property with a single item',
                schema: {
                    paths: {
                        '/url': {
                            get: {
                                responses: {
                                    default: {
                                        description: 'default response',
                                        schema: {
                                            $ref: '#/definitions/Example',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    components: {
                        schemas: {
                            Example: {
                                type: 'object',
                                allOf: [
                                    {
                                        type: 'object',
                                        properties: {
                                            prop: {type: 'string'},
                                            anotherProp: {type: 'string'},
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
                errors: [
                    {
                        msg:
                            'Redundant use of "allOf" with a single item in it.',
                        messageId: 'msg',
                        name: rule.name,
                        location: ['components', 'schemas', 'Example', 'allOf'],
                    },
                ],
            },
        ],
    },
});
