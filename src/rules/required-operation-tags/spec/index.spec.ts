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
            [rule.name]: true,
        },
    };

    it('should NOT error for an empty swagger sample', () => {
        const result = swaggerlint(swaggerSample, config);

        expect(result).toEqual([]);
    });

    it('should error for a tag missing description', () => {
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
                    },
                },
            },
        };
        const modConfig = _.merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg: 'Operation "get" in "/url" is missing tags.',
                name: 'required-operation-tags',
                location: ['paths', '/url', 'get'],
            },
        ];

        expect(result).toEqual(expected);
    });
});