import rule from '../';
import {SwaggerObject, Config} from '../../../types';
import {swaggerlint} from '../../../';
import _ from 'lodash';

const swaggerSample: SwaggerObject = {
    swagger: '2.0',
    info: {
        title: 'stub',
        version: '1.0',
    },
    paths: {},
    tags: [],
};

describe(`rule "${rule.name}"`, () => {
    const config: Config = {
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
                            type: 'string',
                        },
                        {
                            name: 'PET_STORE',
                            type: 'string',
                        },
                        {
                            name: 'pet-age',
                            type: 'string',
                        },
                        {
                            name: 'pet_color',
                            type: 'string',
                        },
                    ],
                },
            },
        };
        const modConfig = _.merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg:
                    'Parameter "PET_STORE" has wrong casing. Should be "petStore".',
                name: 'parameter-casing',
                location: ['paths', '/url', 'parameters', '1'],
            },
            {
                msg:
                    'Parameter "pet-age" has wrong casing. Should be "petAge".',
                name: 'parameter-casing',
                location: ['paths', '/url', 'parameters', '2'],
            },
            {
                msg:
                    'Parameter "pet_color" has wrong casing. Should be "petColor".',
                name: 'parameter-casing',
                location: ['paths', '/url', 'parameters', '3'],
            },
        ];

        expect(result).toEqual(expected);
    });
});
