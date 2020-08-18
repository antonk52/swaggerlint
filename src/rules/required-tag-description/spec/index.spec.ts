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
                it: 'should error for a tag missing description',
                schema: {
                    tags: [
                        {
                            name: 'no-description',
                        },
                        {
                            name: 'with-description',
                            description: 'some description about the tag',
                        },
                    ],
                },
                errors: [
                    {
                        msg: 'Tag "no-description" is missing description.',
                        location: ['tags', '0'],
                        messageId: 'missingDesc',
                        data: {
                            name: 'no-description',
                        },
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
                it: 'should error for a tag missing description',
                schema: {
                    tags: [
                        {
                            name: 'no-description',
                        },
                        {
                            name: 'with-description',
                            description: 'some description about the tag',
                        },
                    ],
                },
                errors: [
                    {
                        msg: 'Tag "no-description" is missing description.',
                        name: 'required-tag-description',
                        messageId: 'missingDesc',
                        data: {
                            name: 'no-description',
                        },
                        location: ['tags', '0'],
                    },
                ],
            },
        ],
    },
});
