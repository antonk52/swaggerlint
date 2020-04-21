import rule from '../';
import {Swagger, SwaggerlintConfig} from '../../../types';
import {swaggerlint} from '../../../';
import _merge from 'lodash.merge';

const swaggerSample: Swagger.SwaggerObject = {
    swagger: '2.0',
    info: {
        title: 'stub',
        version: '1.0',
    },
    paths: {},
    tags: [],
};

describe(`rule "${rule.name}"`, () => {
    const config: SwaggerlintConfig = {
        rules: {
            [rule.name]: true,
        },
    };

    it('should NOT error for an empty swagger sample', () => {
        const result = swaggerlint(swaggerSample, config);

        expect(result).toEqual([]);
    });

    it('should error for a url ending with a slash', () => {
        const mod = {
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
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg: 'Url cannot end with a slash "/url/".',
                name: 'no-trailing-slash',
                location: ['paths'],
            },
        ];

        expect(result).toEqual(expected);
    });

    it('should error for a host url ending with a slash', () => {
        const mod = {
            host: 'http://some.url/',
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg: 'Host url cannot end with a slash.',
                name: 'no-trailing-slash',
                location: [],
            },
        ];

        expect(result).toEqual(expected);
    });
});
