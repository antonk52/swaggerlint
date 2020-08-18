import rule from '../';
import {RuleTester} from '../../../';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    openapi: {
        valid: [
            {
                it: 'should not error for an empty openapi sample',
                schema: {},
            },
        ],
        invalid: [
            {
                it: 'should error for an external reference object',
                schema: {
                    components: {
                        schemas: {
                            Example: {
                                type: 'object',
                                properties: {
                                    foo: {
                                        $ref: '#/components/schemas/Foo',
                                    },
                                    bar: {
                                        $ref: 'schemas.yaml#/Bar',
                                    },
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        msg: 'External references are banned.',
                        messageId: 'msg',
                        name: rule.name,
                        location: [
                            'components',
                            'schemas',
                            'Example',
                            'properties',
                            'bar',
                        ],
                    },
                ],
            },
        ],
    },
});
