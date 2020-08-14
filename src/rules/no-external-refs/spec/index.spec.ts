import rule from '../';
import {SwaggerlintConfig, OpenAPI} from '../../../types';
import {swaggerlint} from '../../../';
import {getOpenAPIObject} from '../../../utils/tests';

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: true,
        },
    };

    describe('OpenAPI', () => {
        it('should NOT error for an empty openapi sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for an external reference object', () => {
            const mod: Partial<OpenAPI.OpenAPIObject> = {
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
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const location = [
                'components',
                'schemas',
                'Example',
                'properties',
                'bar',
            ];
            const expected = [
                {
                    msg: 'External references are banned.',
                    messageId: 'msg',
                    name: rule.name,
                    location,
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
