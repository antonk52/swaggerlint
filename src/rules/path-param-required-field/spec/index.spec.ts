import rule from '../';
import {RuleTester} from '../../../';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [
            {
                it: 'should not error for an empty schema',
                schema: {},
            },
        ],
        invalid: [
            {
                it: 'should error for parameters missing "required" property',
                schema: {
                    paths: {
                        '/url': {
                            get: {
                                parameters: [
                                    {
                                        in: 'query',
                                        name: 'sample',
                                        type: 'string',
                                    },
                                ],
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
                },
                errors: [
                    {
                        data: {
                            name: 'sample',
                        },
                        messageId: 'requiredField',
                        msg:
                            'Parameter "sample" is missing "required" property',
                        name: rule.name,
                        location: ['paths', '/url', 'get', 'parameters', '0'],
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
                it: 'should error for parameters missing "required" property',
                schema: {
                    components: {
                        parameters: {
                            sample: {
                                in: 'query',
                                name: 'sample',
                                schema: {
                                    $ref: '',
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        data: {
                            name: 'sample',
                        },
                        messageId: 'requiredField',
                        msg:
                            'Parameter "sample" is missing "required" property',
                        location: ['components', 'parameters', 'sample'],
                    },
                ],
            },
        ],
    },
});
