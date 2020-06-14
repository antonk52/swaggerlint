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
                },
            },
            definitions: {
                lolkekDTO: {
                    type: 'object',
                    properties: {
                        'some-casing': {type: 'string'},
                        // eslint-disable-next-line
                        some_casing: {type: 'string'},
                        SOME_CASING: {type: 'string'},
                        SomeCasing: {type: 'string'},
                        someCasing: {type: 'string'},
                    },
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const location = ['definitions', 'lolkekDTO', 'properties'];
        const expected = [
            {
                msg:
                    'Property "some-casing" has wrong casing. Should be "someCasing".',
                name: 'object-prop-casing',
                location: [...location, 'some-casing'],
            },
            {
                msg:
                    'Property "some_casing" has wrong casing. Should be "someCasing".',
                name: 'object-prop-casing',
                location: [...location, 'some_casing'],
            },
            {
                msg:
                    'Property "SOME_CASING" has wrong casing. Should be "someCasing".',
                name: 'object-prop-casing',
                location: [...location, 'SOME_CASING'],
            },
            {
                msg:
                    'Property "SomeCasing" has wrong casing. Should be "someCasing".',
                name: 'object-prop-casing',
                location: [...location, 'SomeCasing'],
            },
        ];

        expect(result).toEqual(expected);
    });

    it('should not error for ignored property names', () => {
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
                },
            },
            definitions: {
                lolkekDTO: {
                    type: 'object',
                    properties: {
                        'some-casing': {type: 'string'},
                        SOME_CASING: {type: 'string'},
                        SomeCasing: {type: 'string'},
                    },
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, {
            rules: {
                [rule.name]: ['camel', {ignore: ['SOME_CASING', 'SomeCasing']}],
            },
        });
        const location = [
            'definitions',
            'lolkekDTO',
            'properties',
            'some-casing',
        ];
        const expected = [
            {
                msg:
                    'Property "some-casing" has wrong casing. Should be "someCasing".',
                name: 'object-prop-casing',
                location,
            },
        ];

        expect(result).toEqual(expected);
    });

    it('should NOT error for all non camel cased property names', () => {
        const mod = {
            definitions: {
                lolkekDTO: {
                    type: 'object',
                    properties: {
                        prop: {type: 'string'},
                        anotherProp: {type: 'string'},
                        yetAnotherProp: {type: 'string'},
                    },
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);

        expect(result).toEqual([]);
    });
});
