import rule from '../';
import {RuleTester} from '../../../ruleTester';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [
            {
                it: 'does not error for empty schema',
                schema: {},
                config: {
                    rules: {
                        [rule.name]: true,
                    },
                },
            },
            {
                it: 'should NOT error for all non camel cased property names',
                schema: {
                    definitions: {
                        lolkekDTO: {
                            type: 'object',
                            properties: {
                                prop: {type: 'string'},
                                anotherProp: {type: 'string'},
                                yetAnotherProp: {type: 'string'},
                            },
                        },
                    },
                },
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
                            },
                        },
                    },
                    definitions: {
                        lolkekDTO: {
                            type: 'object',
                            properties: {
                                'some-casing': {type: 'string'},
                                some_casing: {type: 'string'},
                                SOME_CASING: {type: 'string'},
                                SomeCasing: {type: 'string'},
                                someCasing: {type: 'string'},
                            },
                        },
                    },
                },
                errors: [
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'some-casing',
                        },
                        messageId: 'casing',
                        location: [
                            'definitions',
                            'lolkekDTO',
                            'properties',
                            'some-casing',
                        ],
                    },
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'some_casing',
                        },
                        messageId: 'casing',
                        location: [
                            'definitions',
                            'lolkekDTO',
                            'properties',
                            'some_casing',
                        ],
                    },
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'SOME_CASING',
                        },
                        messageId: 'casing',
                        location: [
                            'definitions',
                            'lolkekDTO',
                            'properties',
                            'SOME_CASING',
                        ],
                    },
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'SomeCasing',
                        },
                        messageId: 'casing',
                        location: [
                            'definitions',
                            'lolkekDTO',
                            'properties',
                            'SomeCasing',
                        ],
                    },
                ],
            },
            {
                it: 'should not error for ignored property names',
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
                            },
                        },
                    },
                    definitions: {
                        lolkekDTO: {
                            type: 'object',
                            properties: {
                                'some-casing': {type: 'string'},
                                SOME_CASING: {type: 'string'},
                                SomeCasing: {type: 'string'},
                            },
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: [
                            'camel',
                            {ignore: ['SOME_CASING', 'SomeCasing']},
                        ],
                    },
                },
                errors: [
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'some-casing',
                        },
                        messageId: 'casing',
                        msg:
                            'Property "some-casing" has wrong casing. Should be "someCasing".',
                        location: [
                            'definitions',
                            'lolkekDTO',
                            'properties',
                            'some-casing',
                        ],
                    },
                ],
            },
        ],
    },
    openapi: {
        valid: [
            {
                it: 'should NOT error for an empty openapi sample',
                schema: {},
            },
            {
                it: 'should NOT error for all non camel cased property names',
                schema: {
                    components: {
                        schemas: {
                            lolkekDTO: {
                                type: 'object',
                                properties: {
                                    prop: {type: 'string'},
                                    anotherProp: {type: 'string'},
                                    yetAnotherProp: {type: 'string'},
                                },
                            },
                        },
                    },
                },
            },
        ],
        invalid: [
            {
                it: 'should error for all non camel cased property names',
                schema: {
                    components: {
                        schemas: {
                            lolkekDTO: {
                                type: 'object',
                                properties: {
                                    'some-casing': {type: 'string'},
                                    // eslint-disable-next-line
                                    some_casing: {type: 'string'},
                                    SOME_CASING: {type: 'string'},
                                    SomeCasing: {type: 'string'},
                                    someCasing: {type: 'string'},
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'some-casing',
                        },
                        messageId: 'casing',
                        location: [
                            'components',
                            'schemas',
                            'lolkekDTO',
                            'properties',
                            'some-casing',
                        ],
                    },
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'some_casing',
                        },
                        messageId: 'casing',
                        location: [
                            'components',
                            'schemas',
                            'lolkekDTO',
                            'properties',
                            'some_casing',
                        ],
                    },
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'SOME_CASING',
                        },
                        messageId: 'casing',
                        location: [
                            'components',
                            'schemas',
                            'lolkekDTO',
                            'properties',
                            'SOME_CASING',
                        ],
                    },
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'SomeCasing',
                        },
                        messageId: 'casing',
                        location: [
                            'components',
                            'schemas',
                            'lolkekDTO',
                            'properties',
                            'SomeCasing',
                        ],
                    },
                ],
            },
            {
                it: 'should not error for ignored property names',
                schema: {
                    components: {
                        schemas: {
                            lolkekDTO: {
                                type: 'object',
                                properties: {
                                    'some-casing': {type: 'string'},
                                    SOME_CASING: {type: 'string'},
                                    SomeCasing: {type: 'string'},
                                },
                            },
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: [
                            'camel',
                            {ignore: ['SOME_CASING', 'SomeCasing']},
                        ],
                    },
                },
                errors: [
                    {
                        data: {
                            correctVersion: 'someCasing',
                            propName: 'some-casing',
                        },
                        messageId: 'casing',
                        msg:
                            'Property "some-casing" has wrong casing. Should be "someCasing".',
                        location: [
                            'components',
                            'schemas',
                            'lolkekDTO',
                            'properties',
                            'some-casing',
                        ],
                    },
                ],
            },
        ],
    },
});
