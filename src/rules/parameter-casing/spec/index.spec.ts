import rule from '../';
import {RuleTester} from '../../..';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [
            {
                it: 'should NOT error for an empty swagger sample',
                schema: {},
            },
            {
                it:
                    'allows to set different casing for different parameters(in)',
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
                            parameters: [
                                {
                                    name: 'pet-type',
                                    in: 'path',
                                    required: true,
                                    type: 'string',
                                },
                                {
                                    name: 'petStore',
                                    in: 'body',
                                    type: 'string',
                                    schema: {
                                        $ref: '',
                                    },
                                },
                                {
                                    name: 'pet_color',
                                    in: 'query',
                                    type: 'string',
                                },
                            ],
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: ['camel', {query: 'snake', path: 'kebab'}],
                    },
                },
            },
            {
                it: 'allows to ignore parameter names',
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
                            parameters: [
                                {
                                    name: 'pet-type',
                                    in: 'path',
                                    required: true,
                                    type: 'string',
                                },
                                {
                                    name: 'petStore',
                                    in: 'query',
                                    type: 'string',
                                },
                                {
                                    name: 'pet_color',
                                    in: 'query',
                                    type: 'string',
                                },
                            ],
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: [
                            'camel',
                            {ignore: ['pet-type', 'pet_color']},
                        ],
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
                            parameters: [
                                {
                                    name: 'petType',
                                    in: 'query',
                                    type: 'string',
                                },
                                {
                                    name: 'PET_STORE',
                                    in: 'query',
                                    type: 'string',
                                },
                                {
                                    name: 'pet-age',
                                    in: 'query',
                                    type: 'string',
                                },
                                {
                                    name: 'pet_color',
                                    in: 'query',
                                    type: 'string',
                                },
                            ],
                        },
                    },
                },
                errors: [
                    {
                        data: {
                            correctVersion: 'petStore',
                            name: 'PET_STORE',
                        },
                        messageId: 'casing',
                        msg:
                            'Parameter "PET_STORE" has wrong casing. Should be "petStore".',
                        location: ['paths', '/url', 'parameters', '1', 'name'],
                    },
                    {
                        data: {
                            correctVersion: 'petAge',
                            name: 'pet-age',
                        },
                        messageId: 'casing',
                        msg:
                            'Parameter "pet-age" has wrong casing. Should be "petAge".',
                        location: ['paths', '/url', 'parameters', '2', 'name'],
                    },
                    {
                        data: {
                            correctVersion: 'petColor',
                            name: 'pet_color',
                        },
                        messageId: 'casing',
                        msg:
                            'Parameter "pet_color" has wrong casing. Should be "petColor".',
                        location: ['paths', '/url', 'parameters', '3', 'name'],
                    },
                ],
            },
            {
                it: 'should not error for all ignored property names',
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
                            parameters: [
                                {
                                    name: 'petType',
                                    in: 'query',
                                    type: 'string',
                                },
                                {
                                    name: 'PET_STORE',
                                    in: 'query',
                                    type: 'string',
                                },
                                {
                                    name: 'pet-age',
                                    in: 'query',
                                    type: 'string',
                                },
                                {
                                    name: 'pet_color',
                                    in: 'query',
                                    type: 'string',
                                },
                            ],
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: [
                            'camel',
                            {ignore: ['PET_STORE', 'pet-age']},
                        ],
                    },
                },
                errors: [
                    {
                        data: {
                            correctVersion: 'petColor',
                            name: 'pet_color',
                        },
                        messageId: 'casing',
                        msg:
                            'Parameter "pet_color" has wrong casing. Should be "petColor".',
                        name: 'parameter-casing',
                        location: ['paths', '/url', 'parameters', '3', 'name'],
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
                it:
                    'allows to set different casing for different parameters(in)',
                schema: {
                    components: {
                        parameters: {
                            foo: {
                                name: 'pet-type',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                },
                            },
                            bar: {
                                name: 'petStore',
                                in: 'cookie',
                                schema: {
                                    type: 'string',
                                },
                            },
                            baz: {
                                name: 'pet_color',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: ['camel', {query: 'snake', path: 'kebab'}],
                    },
                },
            },
            {
                it: 'allows to ignore parameter names',
                schema: {
                    components: {
                        parameters: {
                            foo: {
                                name: 'pet-type',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                },
                            },
                            bar: {
                                name: 'petStore',
                                in: 'cookie',
                                schema: {
                                    type: 'string',
                                },
                            },
                            baz: {
                                name: 'pet_color',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: [
                            'camel',
                            {ignore: ['pet-type', 'pet_color']},
                        ],
                    },
                },
            },
        ],
        invalid: [
            {
                it: 'should error for all non camel cased property names',
                schema: {
                    components: {
                        parameters: {
                            foo: {
                                name: 'petType',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                            bar: {
                                name: 'PET_STORE',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                            baz: {
                                name: 'pet-age',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                            zoo: {
                                name: 'pet_color',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        msg:
                            'Parameter "PET_STORE" has wrong casing. Should be "petStore".',
                        data: {
                            correctVersion: 'petStore',
                            name: 'PET_STORE',
                        },
                        messageId: 'casing',
                        name: 'parameter-casing',
                        location: ['components', 'parameters', 'bar', 'name'],
                    },
                    {
                        msg:
                            'Parameter "pet-age" has wrong casing. Should be "petAge".',
                        data: {
                            correctVersion: 'petAge',
                            name: 'pet-age',
                        },
                        messageId: 'casing',
                        name: 'parameter-casing',
                        location: ['components', 'parameters', 'baz', 'name'],
                    },
                    {
                        data: {
                            correctVersion: 'petColor',
                            name: 'pet_color',
                        },
                        messageId: 'casing',
                        msg:
                            'Parameter "pet_color" has wrong casing. Should be "petColor".',
                        name: 'parameter-casing',
                        location: ['components', 'parameters', 'zoo', 'name'],
                    },
                ],
            },
            {
                it: 'should not error for all ignored property names',
                schema: {
                    components: {
                        parameters: {
                            foo: {
                                name: 'petType',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                            bar: {
                                name: 'PET_STORE',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                            baz: {
                                name: 'pet-age',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                            zoo: {
                                name: 'pet_color',
                                in: 'query',
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                config: {
                    rules: {
                        [rule.name]: [
                            'camel',
                            {ignore: ['PET_STORE', 'pet-age']},
                        ],
                    },
                },
                errors: [
                    {
                        msg:
                            'Parameter "pet_color" has wrong casing. Should be "petColor".',
                        data: {
                            correctVersion: 'petColor',
                            name: 'pet_color',
                        },
                        messageId: 'casing',
                        name: 'parameter-casing',
                        location: ['components', 'parameters', 'zoo', 'name'],
                    },
                ],
            },
        ],
    },
});
