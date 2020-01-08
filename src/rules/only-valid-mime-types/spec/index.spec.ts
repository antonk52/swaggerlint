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
                        consumes: ['not/valid'],
                        produces: ['*/*'],
                    },
                },
            },
            produces: ['application/typescript'],
            consumes: ['lol/kek'],
        };
        const modConfig = _.merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg: '"lol/kek" is not a valid mime type.',
                name: rule.name,
                location: ['consumes', '0'],
            },
            {
                msg: '"application/typescript" is not a valid mime type.',
                name: rule.name,
                location: ['produces', '0'],
            },
            {
                msg: '"not/valid" is not a valid mime type.',
                name: rule.name,
                location: ['paths', '/url', 'get', 'consumes', '0'],
            },
            {
                msg: '"*/*" is not a valid mime type.',
                name: rule.name,
                location: ['paths', '/url', 'get', 'produces', '0'],
            },
        ];

        expect(result).toEqual(expected);
    });
});
