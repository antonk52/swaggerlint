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
                it: 'should error for empty object type',
                schema: {
                    definitions: {
                        InvalidDTO: {
                            type: 'object',
                        },
                        ValidDTO: {
                            type: 'object',
                            additionalProperties: {
                                type: 'string',
                            },
                            properties: {
                                a: {
                                    type: 'string',
                                },
                                AllOf: {
                                    type: 'object',
                                    allOf: [
                                        {
                                            $ref:
                                                '#/components/schemas/InvalidDTO',
                                        },
                                        {
                                            $ref:
                                                '#/components/schemas/ValidDTO',
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        msg: `has "object" type but is missing "properties" | "additionalProperties" | "allOf"`,
                        messageId: 'swagger',
                        name: rule.name,
                        location: ['definitions', 'InvalidDTO'],
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
                it: 'should error for empty object type',
                schema: {
                    components: {
                        schemas: {
                            InvalidDTO: {
                                type: 'object',
                            },
                            ValidDTO: {
                                type: 'object',
                                additionalProperties: {
                                    type: 'string',
                                },
                                properties: {
                                    a: {
                                        type: 'string',
                                    },
                                    AllOf: {
                                        type: 'object',
                                        allOf: [
                                            {
                                                $ref:
                                                    '#/components/schemas/InvalidDTO',
                                            },
                                            {
                                                $ref:
                                                    '#/components/schemas/ValidDTO',
                                            },
                                        ],
                                    },
                                    OneOf: {
                                        type: 'object',
                                        oneOf: [
                                            {
                                                $ref:
                                                    '#/components/schemas/InvalidDTO',
                                            },
                                            {
                                                $ref:
                                                    '#/components/schemas/ValidDTO',
                                            },
                                        ],
                                    },
                                    AnyOf: {
                                        type: 'object',
                                        anyOf: [
                                            {
                                                $ref:
                                                    '#/components/schemas/InvalidDTO',
                                            },
                                            {
                                                $ref:
                                                    '#/components/schemas/ValidDTO',
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                errors: [
                    {
                        msg: `has "object" type but is missing "properties" | "additionalProperties" | "allOf" | "anyOf" | "oneOf"`,
                        messageId: 'openapi',
                        name: rule.name,
                        location: ['components', 'schemas', 'InvalidDTO'],
                    },
                ],
            },
        ],
    },
});
