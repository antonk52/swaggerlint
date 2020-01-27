import rule from '../';
import {SwaggerObject, Config} from '../../../types';
import {swaggerlint} from '../../../';
import _merge from 'lodash.merge';

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
            [rule.name]: true,
        },
    };

    it('should NOT error for an empty swagger sample', () => {
        const result = swaggerlint(swaggerSample, config);

        expect(result).toEqual([]);
    });

    it('should error for a SchemaObject with "allOf" property containing a single item', () => {
        const mod = {
            paths: {
                '/url': {
                    get: {
                        responses: {
                            default: {
                                description: 'default response',
                                schema: {
                                    $ref: '#/definitions/Example',
                                },
                            },
                        },
                    },
                },
            },
            definitions: {
                Example: {
                    type: 'object',
                    allOf: [
                        {
                            type: 'object',
                            properties: {
                                prop: {type: 'string'},
                                anotherProp: {type: 'string'},
                            },
                        },
                    ],
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const location = ['definitions', 'Example'];
        const expected = [
            {
                msg: 'Redundant use of "allOf" with a single item in it.',
                name: 'no-single-allof',
                location,
            },
        ];

        expect(result).toEqual(expected);
    });

    it('should NOT error for a SchemaObject with "allOf" property containing multiple items', () => {
        const mod = {
            paths: {
                '/url': {
                    get: {
                        responses: {
                            default: {
                                description: 'default response',
                                schema: {
                                    $ref: '#/definitions/Example',
                                },
                            },
                        },
                    },
                },
            },
            definitions: {
                Example: {
                    type: 'object',
                    allOf: [
                        {
                            type: 'object',
                            name: 'obj',
                            properties: {
                                prop: {type: 'string'},
                                anotherProp: {type: 'string'},
                            },
                        },
                        {
                            type: 'object',
                            name: 'name',
                        },
                    ],
                },
            },
        };
        const modConfig = _merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);

        expect(result).toEqual([]);
    });
});
