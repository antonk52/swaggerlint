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
                    data: {
                        url: '/url/',
                    },
                    messageId: 'url',
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
                    data: {
                        url: 'http://some.url/',
                    },
                    msg:
                        'Host cannot end with a slash, your host url is "http://some.url/".',
                    messageId: 'host',
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
                    data: {
                        url: '/url/',
                    },
                    messageId: 'url',
                    msg: 'Url cannot end with a slash "/url/".',
                    name: 'no-trailing-slash',
                    location: ['paths', '/url/'],
                },
            ];

            expect(result).toEqual(expected);
        });

        it('should error for a server url ending with a slash', () => {
            const mod = {
                servers: [{url: 'http://some.url/'}],
            };
            const modConfig = getOpenAPIObject(mod);
            const result = swaggerlint(modConfig, config);
            const expected = [
                {
                    data: {
                        url: 'http://some.url/',
                    },
                    msg:
                        'Server url cannot end with a slash "http://some.url/".',
                    messageId: 'server',
                    name: 'no-trailing-slash',
                    location: ['servers', '0', 'url'],
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
