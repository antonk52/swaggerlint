import rule from '../';
import {SwaggerlintConfig} from '../../../types';
import {swaggerlint} from '../../../';
import {getSwaggerObject, getOpenAPIObject} from '../../../utils/tests';

// eslint-disable-next-line
const pathsWithSlashes: any = {
    paths: {
        '/url/': {
            get: {
                responses: {
                    default: {
                        description: 'default response',
                        schema: {
                            type: 'string',
                        },
                    },
                },
            },
        },
        '/correct-url': {
            get: {
                responses: {
                    default: {
                        description: 'default response',
                        schema: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    },
};

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: true,
        },
    };
    describe('swagger', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getSwaggerObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a url ending with a slash', () => {
            const modConfig = getSwaggerObject(pathsWithSlashes);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Url cannot end with a slash "/url/".',
                    name: 'no-trailing-slash',
                    location: ['paths', '/url/'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should error for a host url ending with a slash', () => {
            const mod = {
                host: 'http://some.url/',
            };
            const modConfig = getSwaggerObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Host url cannot end with a slash.',
                    name: 'no-trailing-slash',
                    location: ['host'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });

    describe('OpenAPI', () => {
        it('should NOT error for an empty swagger sample', () => {
            const result = swaggerlint(getOpenAPIObject({}), config);

            expect(result).toEqual([]);
        });

        it('should error for a url ending with a slash', () => {
            const modConfig = getOpenAPIObject(pathsWithSlashes);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Url cannot end with a slash "/url/".',
                    name: 'no-trailing-slash',
                    location: ['paths', '/url/'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should error for a host url ending with a slash', () => {
            const mod = {
                servers: [{url: 'http://some.url/'}],
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    msg: 'Server url cannot end with a slash.',
                    name: 'no-trailing-slash',
                    location: ['servers', '0', 'url'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
