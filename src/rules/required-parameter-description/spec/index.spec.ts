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
                '/url': {
                    get: {
                        responses: {
                            default: {
                                description: 'default response',
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                        parameters: [
                            {
                                name: 'petId',
                                in: 'path',
                                required: true,
                                type: 'string',
                            },
                        ],
                    },
                    parameters: [
                        {
                            name: 'petName',
                            in: 'query',
                            required: true,
                            type: 'string',
                        },
                    ],
                },
            },
            parameters: [
                {
                    name: 'petAge',
                    in: 'body',
                    required: true,
                    type: 'string',
                },
                {
                    name: 'petColor',
                    in: 'body',
                    description: 'color of required pet',
                    required: true,
                    type: 'string',
                },
            ],
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg: '"petId" parameter is missing description.',
                name: 'required-parameter-description',
                location: ['paths', '/url', 'get', 'parameters', '0'],
            },
            {
                msg: '"petName" parameter is missing description.',
                name: 'required-parameter-description',
                location: ['paths', '/url', 'parameters', '0'],
            },
            {
                msg: '"petAge" parameter is missing description.',
                name: 'required-parameter-description',
                location: ['parameters', '0'],
            },
        ];

        expect(result).toEqual(expected);
    });
});
