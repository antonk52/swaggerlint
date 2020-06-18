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
            [rule.name]: ['camel'],
        },
    };

    it('should NOT error for an empty swagger sample', () => {
        const result = swaggerlint(swaggerSample, config);

        expect(result).toEqual([]);
    });

    it('should error for all non camel cased property names', () => {
        const mod = {
            paths: {
                '/url': {
                    get: {
                        responses: {
                            default: {
                                description: 'default response',
                                schema: {
                                    $ref: '#/definitions/lolkekDTO',
                                },
                            },
                        },
                    },
                    parameters: [
                        {
                            name: 'petType',
                            in: 'query',
                            type: 'string',
                        },
                        {
                            name: 'PET_STORE',
                            in: 'query',
                            type: 'string',
                        },
                        {
                            name: 'pet-age',
                            in: 'query',
                            type: 'string',
                        },
                        {
                            name: 'pet_color',
                            in: 'query',
                            type: 'string',
                        },
                    ],
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg:
                    'Parameter "PET_STORE" has wrong casing. Should be "petStore".',
                name: 'parameter-casing',
                location: ['paths', '/url', 'parameters', '1', 'name'],
            },
            {
                msg:
                    'Parameter "pet-age" has wrong casing. Should be "petAge".',
                name: 'parameter-casing',
                location: ['paths', '/url', 'parameters', '2', 'name'],
            },
            {
                msg:
                    'Parameter "pet_color" has wrong casing. Should be "petColor".',
                name: 'parameter-casing',
                location: ['paths', '/url', 'parameters', '3', 'name'],
            },
        ];

        expect(result).toEqual(expected);
    });

    it('should not error for all ignored property names', () => {
        const mod = {
            paths: {
                '/url': {
                    get: {
                        responses: {
                            default: {
                                description: 'default response',
                                schema: {
                                    $ref: '#/definitions/lolkekDTO',
                                },
                            },
                        },
                    },
                    parameters: [
                        {
                            name: 'petType',
                            in: 'query',
                            type: 'string',
                        },
                        {
                            name: 'PET_STORE',
                            in: 'query',
                            type: 'string',
                        },
                        {
                            name: 'pet-age',
                            in: 'query',
                            type: 'string',
                        },
                        {
                            name: 'pet_color',
                            in: 'query',
                            type: 'string',
                        },
                    ],
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, {
            rules: {[rule.name]: ['camel', {ignore: ['PET_STORE', 'pet-age']}]},
        });
        const expected = [
            {
                msg:
                    'Parameter "pet_color" has wrong casing. Should be "petColor".',
                name: 'parameter-casing',
                location: ['paths', '/url', 'parameters', '3', 'name'],
            },
        ];

        expect(result).toEqual(expected);
    });

    it('allows to set different casing for different parameters(in)', () => {
        const mod = {
            paths: {
                '/url': {
                    get: {
                        responses: {
                            default: {
                                description: 'default response',
                                schema: {
                                    $ref: '#/definitions/lolkekDTO',
                                },
                            },
                        },
                    },
                    parameters: [
                        {
                            name: 'pet-type',
                            in: 'path',
                            type: 'string',
                        },
                        {
                            name: 'petStore',
                            in: 'body',
                            type: 'string',
                        },
                        {
                            name: 'pet_color',
                            in: 'query',
                            type: 'string',
                        },
                    ],
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, {
            rules: {[rule.name]: ['camel', {query: 'snake', path: 'kebab'}]},
        });

        expect(result).toEqual([]);
    });

    it('allos to ignore parameter names', () => {
        const mod = {
            paths: {
                '/url': {
                    get: {
                        responses: {
                            default: {
                                description: 'default response',
                                schema: {
                                    $ref: '#/definitions/lolkekDTO',
                                },
                            },
                        },
                    },
                    parameters: [
                        {
                            name: 'pet-type',
                            in: 'path',
                            type: 'string',
                        },
                        {
                            name: 'petStore',
                            in: 'body',
                            type: 'string',
                        },
                        {
                            name: 'pet_color',
                            in: 'query',
                            type: 'string',
                        },
                    ],
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, {
            rules: {
                [rule.name]: ['camel', {ignore: ['pet-type', 'pet_color']}],
            },
        });

        expect(result).toEqual([]);
    });
});
