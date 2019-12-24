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
        const modConfig = _.merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);
        const expected = [
            {
                msg: 'Property "some-casing" has wrong casing on "lolkekDTO"',
                name: 'object-prop-casing',
            },
            {
                msg: 'Property "some_casing" has wrong casing on "lolkekDTO"',
                name: 'object-prop-casing',
            },
            {
                msg: 'Property "SOME_CASING" has wrong casing on "lolkekDTO"',
                name: 'object-prop-casing',
            },
            {
                msg: 'Property "SomeCasing" has wrong casing on "lolkekDTO"',
                name: 'object-prop-casing',
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
        const modConfig = _.merge(mod, swaggerSample);
        const result = swaggerlint(modConfig, config);

        expect(result).toEqual([]);
    });
});
