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
                it: 'should error for a ReferenceObject containing description',
                schema: {
                    paths: {},
                    definitions: {
                        Example: {
                            type: 'object',
                            properties: {
                                prop: {
                                    $ref: '#/definitions/Foo',
                                    description: 'Foo bar',
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        name: rule.name,
                        messageId: 'noRefProps',
                        location: [
                            'definitions',
                            'Example',
                            'properties',
                            'prop',
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
        ],
        invalid: [
            {
                it: 'errors for a reference object containing description',
                schema: {
                    paths: {},
                    components: {
                        schemas: {
                            Example: {
                                type: 'object',
                                properties: {
                                    foo: {
                                        $ref: '#/components/schemas/Foo',
                                        description: 'Foo prop',
                                    },
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        name: rule.name,
                        messageId: 'noRefProps',
                        location: [
                            'components',
                            'schemas',
                            'Example',
                            'properties',
                            'foo',
                        ],
                    },
                ],
            },
        ],
    },
});
