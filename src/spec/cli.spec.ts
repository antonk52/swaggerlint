import {cli} from '../cli';

jest.mock('fs', () => ({
    existsSync: jest.fn(),
}));
jest.mock('js-yaml');
jest.mock('../index', () => ({
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

        getConfig.mockReturnValueOnce({config: 'lookedup-config'});

        const result = await cli({_: []});

        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(getConfig.mock.calls).toEqual([[undefined]]);

        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    name,
                    location: [],
                    msg:
                        'Neither url nor path were provided for your swagger scheme',
                },
            ],
        });
    });

    it('exits when passed config path does not exist', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({
            error: 'Swaggerlint config with a provided path does not exits.',
            config: 'default-config',
        });

        const config = 'lol/kek/foo/bar';
        const result = await cli({_: [], config});

        expect(getConfig.mock.calls).toEqual([[config]]);
        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    msg:
                        'Swaggerlint config with a provided path does not exits.',
                    location: [],
                    name,
                },
            ],
        });
    });

    it('uses default config when cannot locate config file', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');
        const {getSwaggerByPath} = require('../utils/swaggerfile');

        const swagger = {file: 'swagger'};
        getSwaggerByPath.mockReturnValueOnce({swagger});

        getConfig.mockReturnValueOnce({
            error: null,
            config: {rules: 'default-config'},
        });

        swaggerlint.mockReturnValueOnce([]);

        const result = await cli({_: ['some-path']});

        expect(getConfig.mock.calls.length === 1).toBe(true);
        expect(swaggerlint.mock.calls).toEqual([
            [swagger, {rules: 'default-config'}],
        ]);
        expect(result).toEqual({
            code: 0,
            errors: [],
            swagger,
        });
    });

    it('exits when passed path to swagger does not exist', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');
        const {getSwaggerByPath} = require('../utils/swaggerfile');

        getConfig.mockReturnValueOnce({config: {rules: 'lookedup-config'}});

        const error = 'File at the provided path does not exist.';
        getSwaggerByPath.mockReturnValueOnce({swagger: {}, error});

        const path = 'lol/kek/foo/bar';
        const result = await cli({_: [path]});

        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    msg: error,
                    location: [],
                    name,
                },
            ],
        });
    });

    it('exits when cannot fetch from passed url', async () => {
        const {swaggerlint} = require('../index');
        const {getSwaggerByUrl} = require('../utils/swaggerfile');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({config: {rules: 'lookedup-config'}});
        getSwaggerByUrl.mockImplementation(() => Promise.reject(null));

        const url = 'https://lol.org/openapi';
        const result = await cli({_: [url]});

        expect(getSwaggerByUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    msg: 'Cannot fetch swagger scheme from the provided url',
                    location: [],
                    name,
                },
            ],
        });
    });

    it('returns code 0 when no errors are found', async () => {
        const {swaggerlint} = require('../index');
        const {getSwaggerByUrl} = require('../utils/swaggerfile');
        const {getConfig} = require('../utils/config');

        getConfig.mockReturnValueOnce({config: {rules: 'lookedup-config'}});
        swaggerlint.mockImplementation(() => []);
        getSwaggerByUrl.mockImplementation(() => Promise.resolve({}));

        const url = 'https://lol.org/openapi';
        const result = await cli({_: [url]});

        expect(getSwaggerByUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls).toEqual([
            [{}, {rules: 'lookedup-config'}],
        ]);
        expect(result).toEqual({
            code: 0,
            errors: [],
            swagger: {},
        });
    });

    it('returns code 1 when errors are found', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils/config');
        const {getSwaggerByUrl} = require('../utils/swaggerfile');
        const errors = [{name: 'foo', location: [], msg: 'bar'}];

        getConfig.mockReturnValueOnce({config: {rules: 'lookedup-config'}});
        swaggerlint.mockImplementation(() => errors);
        getSwaggerByUrl.mockImplementation(() => Promise.resolve({}));

        const url = 'https://lol.org/openapi';
        const result = await cli({_: [url]});

        expect(getSwaggerByUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls).toEqual([
            [{}, {rules: 'lookedup-config'}],
        ]);
        expect(result).toEqual({
            code: 1,
            errors,
            swagger: {},
        });
    });
});
