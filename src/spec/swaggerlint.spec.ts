import {swaggerlint} from '../swaggerlint';
import {SwaggerlintConfig} from '../types';
import * as walker from '../walker';
import {getSwaggerObject} from '../utils/tests';

jest.mock('../walker', () => ({
    walkSwagger: jest.fn(),
    walkOpenAPI: jest.fn(),
}));
jest.mock('../defaultConfig', () => ({
    rules: {
        'known-rule': true,
    },
}));
jest.mock('../rules', () => ({
    rules: {
        'known-rule': {
            name: 'known-rule',
            meta: {
                schema: {
                    type: 'array',
                    items: [
                        {
                            type: 'string',
                            enum: ['known', 'words'],
                        },
                        {
                            type: 'object',
                            required: ['ignore'],
                            properties: {
                                ignore: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            swaggerVisitor: {},
            defaultSetting: ['known', {}],
        },
        'always-valid-rule': {
            swaggerVisitor: {},
        },
    },
}));

describe('swaggerlint', () => {
    const swagger = getSwaggerObject({});

    it('returns and error when walker returns errors', () => {
        const errors = [
            {
                msg: 'err parsing swagger',
                location: [],
                name: 'swaggerlint-core',
            },
        ];
        const config = {rules: {}};

        (walker.walkSwagger as jest.Mock).mockReturnValueOnce({errors});

        const result = swaggerlint(swagger, config);

        expect(result).toEqual(errors);
    });

    it('throws an error only for unknown rules', () => {
        (walker.walkSwagger as jest.Mock).mockReturnValueOnce({
            visitors: {
                VisitorExample: [],
            },
        });

        const config = {
            rules: {
                'unknown-rule': true,
                'always-valid-rule': true,
            },
        };

        const result = swaggerlint(swagger, config);

        expect(result).toEqual([
            {
                msg: `swaggerlint.config.js contains unknown rule "unknown-rule"`,
                name: 'swaggerlint-core',
                location: [],
            },
        ]);
    });

    it('has an error when no rules are enabled', () => {
        (walker.walkSwagger as jest.Mock).mockReturnValueOnce({
            visitors: {
                visitorexample: [],
            },
        });

        const config = {
            rules: {
                'known-rule': false,
            },
        };

        const result = swaggerlint(swagger, config);

        expect(result).toEqual([
            {
                location: [],
                msg:
                    'Found 0 enabled rules. Swaggerlint requires at least one rule enabled.',
                name: 'swaggerlint-core',
            },
        ]);
    });

    it('returns an error when rule setting validation does not pass', () => {
        (walker.walkSwagger as jest.Mock).mockReturnValueOnce({
            visitors: {
                visitorexample: [],
            },
        });

        const config: SwaggerlintConfig = {
            rules: {
                'known-rule': ['invalid-setting'],
                'always-valid-rule': true,
            },
        };
        const result = swaggerlint(swagger, config);
        expect(result).toEqual([
            {
                msg:
                    'Invalid rule setting. Got "invalid-setting", expected: "known", "words"',
                location: [],
                name: 'known-rule',
            },
        ]);
    });
});
