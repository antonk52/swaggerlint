import {swaggerlint} from '../swaggerlint';
import {SwaggerObject, SwaggerlintConfig} from '../types';

jest.mock('../walker', () => jest.fn());
jest.mock('../defaultConfig', () => ({
    rules: {
        'known-rule': true,
    },
}));
jest.mock('../rules', () => ({
    'known-rule': {
        visitor: {},
        isValidSetting: jest.fn(() => true),
    },
}));

describe('swaggerlint', () => {
    const swagger: SwaggerObject = {
        swagger: '2.0',
        info: {
            title: 'Sample swagger object',
            version: '1.0',
        },
        paths: {},
        tags: [],
    };

    it('returns and error when walker returns errors', () => {
        const walker = require('../walker');
        const errors = [
            {
                msg: 'err parsing swagger',
                location: [],
                name: 'swaggerlint-core',
            },
        ];
        const config = {rules: {}};

        walker.mockReturnValueOnce({errors});

        const result = swaggerlint(swagger, config);

        expect(result).toEqual(errors);
    });

    it('throws an error only for unknown rules', () => {
        const walker = require('../walker');
        walker.mockReturnValueOnce({
            visitors: {
                VisitorExample: [],
            },
        });

        const config = {
            rules: {
                'unknown-rule': true,
                'known-rule': true,
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

    it('has no errors when rules are off', () => {
        const walker = require('../walker');
        walker.mockReturnValueOnce({
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

        expect(result).toEqual([]);
    });

    it('returns an error when rule setting validation does not pass', () => {
        const walker = require('../walker');
        walker.mockReturnValueOnce({
            visitors: {
                visitorexample: [],
            },
        });

        const rules = require('../rules');
        rules['known-rule'].isValidSetting.mockReturnValueOnce(false);

        const config: SwaggerlintConfig = {
            rules: {
                'known-rule': ['invalid-setting'],
            },
        };
        const result = swaggerlint(swagger, config);
        expect(result).toEqual([
            {
                msg: 'Invalid rule setting',
                location: [],
                name: 'known-rule',
            },
        ]);
    });
});
