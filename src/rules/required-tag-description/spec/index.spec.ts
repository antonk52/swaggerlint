import rule from '../';
import {SwaggerlintConfig} from '../../../types';
import {swaggerlint} from '../../../';
import {getSwaggerObject, getOpenAPIObject} from '../../../utils/tests';

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: true,
        },
    };

    const mod = {
        tags: [
            {
                name: 'no-description',
            },
            {
                name: 'with-description',
                description: 'some description about the tag',
            },
        ],
    };

    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getSwaggerObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a tag missing description', () => {
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Tag "no-description" is missing description.',
                    name: 'required-tag-description',
                    location: ['tags', '0'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });

    describe('openapi', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a tag missing description', () => {
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Tag "no-description" is missing description.',
                    name: 'required-tag-description',
                    location: ['tags', '0'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
