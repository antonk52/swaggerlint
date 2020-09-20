import {cli} from '../cli';

jest.mock('fs', () => ({
    existsSync: jest.fn(),
}));
jest.mock('js-yaml');
jest.mock('../swaggerlint', () => ({
    swaggerlint: jest.fn(),
}));
jest.mock('../utils', () => ({
    log: jest.fn(),
}));
jest.mock('../utils/config', () => ({
    getConfig: jest.fn(),
}));
jest.mock('../utils/swaggerfile', () => ({
    getSwaggerByPath: jest.fn(),
    getSwaggerByUrl: jest.fn(),
}));

beforeEach(() => {
    jest.resetAllMocks();
});

const name = 'swaggerlint-core';

describe('cli function', () => {
    it('exits when neither url nor swaggerPath are passed', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({
            type: 'success',
            config: {},
            filepath: '~/foo/bar/baz.js',
        });

        const result = await cli({_: []});

        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(getConfig.mock.calls).toEqual([[undefined]]);

        expect(result).toEqual({
            code: 1,
            results: [
                {
                    src: '',
                    schema: undefined,
                    errors: [
                        {
                            name,
                            location: [],
                            msg:
                                'Neither url nor path were provided for your swagger scheme',
                        },
                    ],
                },
            ],
        });
    });

    it('exits if config validation did not pass', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({
            type: 'success',
            config: 'lookedup-config',
            filepath: '~/foo/bar/baz.js',
        });

        const result = await cli({_: []});

        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(getConfig.mock.calls).toEqual([[undefined]]);

        expect(result).toEqual({
            code: 1,
            results: [
                {
                    src: '~/foo/bar/baz.js',
                    schema: undefined,
                    errors: [
                        {
                            name,
                            location: [],
                            msg: 'Invalid config',
                        },
                    ],
                },
            ],
        });
    });

    it('exits when passed config path does not exist', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({
            error: 'Swaggerlint config with a provided path does not exits.',
            type: 'fail',
        });

        const config = 'lol/kek/foo/bar';
        const result = await cli({_: [], config});

        expect(getConfig.mock.calls).toEqual([[config]]);
        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            results: [
                {
                    src: '',
                    schema: undefined,
                    errors: [
                        {
                            msg:
                                'Swaggerlint config with a provided path does not exits.',
                            location: [],
                            name,
                        },
                    ],
                },
            ],
        });
    });

    it('uses default config when cannot locate config file', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');
        const {getSwaggerByPath} = require('../utils/swaggerfile');

        const schema = {file: 'swagger'};
        getSwaggerByPath.mockReturnValueOnce({swagger: schema});

        getConfig.mockReturnValueOnce({
            type: 'success',
            config: {rules: {}},
        });

        swaggerlint.mockReturnValueOnce([]);

        const result = await cli({_: ['some-path']});

        expect(getConfig.mock.calls.length === 1).toBe(true);
        expect(swaggerlint.mock.calls).toEqual([[schema, {rules: {}}]]);
        expect(result).toEqual({
            code: 0,
            results: [
                {
                    src: 'some-path',
                    errors: [],
                    schema,
                },
            ],
        });
    });

    it('exits when passed path to swagger does not exist', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');
        const {getSwaggerByPath} = require('../utils/swaggerfile');

        getConfig.mockReturnValueOnce({
            type: 'success',
            config: {rules: {}},
        });

        const error = 'File at the provided path does not exist.';
        getSwaggerByPath.mockReturnValueOnce({schema: {}, error});

        const path = 'lol/kek/foo/bar';
        const result = await cli({_: [path]});

        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            results: [
                {
                    src: path,
                    schema: undefined,
                    errors: [
                        {
                            msg: error,
                            location: [],
                            name,
                        },
                    ],
                },
            ],
        });
    });

    it('exits when cannot fetch from passed url', async () => {
        const {swaggerlint} = require('../index');
        const {getSwaggerByUrl} = require('../utils/swaggerfile');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({
            type: 'success',
            config: {rules: {}},
        });
        getSwaggerByUrl.mockImplementation(() => Promise.reject(null));

        const url = 'https://lol.org/openapi';
        const result = await cli({_: [url]});

        expect(getSwaggerByUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            results: [
                {
                    src: url,
                    schema: undefined,
                    errors: [
                        {
                            msg:
                                'Cannot fetch swagger scheme from the provided url',
                            location: [],
                            name,
                        },
                    ],
                },
            ],
        });
    });

    it('returns code 0 when no errors are found', async () => {
        const {swaggerlint} = require('../index');
        const {getSwaggerByUrl} = require('../utils/swaggerfile');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({type: 'success', config: {rules: {}}});
        swaggerlint.mockImplementation(() => []);
        getSwaggerByUrl.mockImplementation(() => Promise.resolve({}));

        const url = 'https://lol.org/openapi';
        const result = await cli({_: [url]});

        expect(getSwaggerByUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls).toEqual([[{}, {rules: {}}]]);
        expect(result).toEqual({
            code: 0,
            results: [
                {
                    src: url,
                    errors: [],
                    schema: {},
                },
            ],
        });
    });

    it('returns code 1 when errors are found', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');
        const {getSwaggerByUrl} = require('../utils/swaggerfile');
        const errors = [{name: 'foo', location: [], msg: 'bar'}];

        getConfig.mockReturnValueOnce({type: 'success', config: {rules: {}}});
        swaggerlint.mockImplementation(() => errors);
        getSwaggerByUrl.mockImplementation(() => Promise.resolve({}));

        const url = 'https://lol.org/openapi';
        const result = await cli({_: [url]});

        expect(getSwaggerByUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls).toEqual([[{}, {rules: {}}]]);
        expect(result).toEqual({
            code: 1,
            results: [
                {
                    src: url,
                    errors,
                    schema: {},
                },
            ],
        });
    });

    it('returns errors for both passed schemas', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');
        const {getSwaggerByUrl} = require('../utils/swaggerfile');
        const errors = [{name: 'foo', location: [], msg: 'bar'}];

        getConfig.mockReturnValueOnce({type: 'success', config: {rules: {}}});
        swaggerlint.mockImplementation(() => errors);
        getSwaggerByUrl.mockImplementation(() => Promise.resolve({}));

        const url = 'https://lol.org/openapi';
        const result = await cli({_: [url, url]});

        expect(getSwaggerByUrl.mock.calls).toEqual([[url], [url]]);
        expect(swaggerlint.mock.calls).toEqual([
            [{}, {rules: {}}],
            [{}, {rules: {}}],
        ]);
        expect(result).toEqual({
            code: 1,
            results: [
                {
                    src: url,
                    errors,
                    schema: {},
                },
                {
                    src: url,
                    errors,
                    schema: {},
                },
            ],
        });
    });
});
