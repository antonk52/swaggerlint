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
                it: 'should error for parameters with no description',
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
                                parameters: [
                                    {
                                        name: 'petId',
                                        in: 'path',
                                        required: true,
                                        type: 'string',
                                    },
                                ],
                            },
                            parameters: [
                                {
                                    name: 'petName',
                                    in: 'query',
                                    required: true,
                                    type: 'string',
                                },
                            ],
                        },
                    },
                    parameters: {
                        petAge: {
                            name: 'petAge',
                            in: 'body',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        petColor: {
                            name: 'petColor',
                            in: 'body',
                            description: 'color of required pet',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        emptyDesc: {
                            name: 'emptyDesc',
                            in: 'query',
                            description: '',
                            type: 'string',
                        },
                    },
                },
                errors: [
                    {
                        msg: '"petId" parameter is missing description.',
                        messageId: 'missingDesc',
                        data: {
                            name: 'petId',
                        },
                        name: 'required-parameter-description',
                        location: ['paths', '/url', 'get', 'parameters', '0'],
                    },
                    {
                        msg: '"petName" parameter is missing description.',
                        messageId: 'missingDesc',
                        data: {
                            name: 'petName',
                        },
                        name: 'required-parameter-description',
                        location: ['paths', '/url', 'parameters', '0'],
                    },
                    {
                        msg: '"petAge" parameter is missing description.',
                        messageId: 'missingDesc',
                        data: {
                            name: 'petAge',
                        },
                        name: 'required-parameter-description',
                        location: ['parameters', 'petAge'],
                    },
                    {
                        msg: '"emptyDesc" parameter is missing description.',
                        messageId: 'missingDesc',
                        data: {
                            name: 'emptyDesc',
                        },
                        name: 'required-parameter-description',
                        location: ['parameters', 'emptyDesc', 'description'],
                    },
                ],
            },
        ],
    },
    openapi: {
        valid: [
            {
                it: 'should NOT error for an empty schema',
                schema: {},
            },
        ],
        invalid: [
            {
                it: 'should error for a parameters with no description',
                schema: {
                    components: {
                        parameters: {
                            petId: {
                                name: 'petId',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        msg: '"petId" parameter is missing description.',
                        messageId: 'missingDesc',
                        data: {
                            name: 'petId',
                        },
                        name: rule.name,
                        location: ['components', 'parameters', 'petId'],
                    },
                ],
            },
        ],
    },
});
