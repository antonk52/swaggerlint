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
    fetchUrl: jest.fn(),
    isYamlPath: jest.fn(),
    getConfig: jest.fn(),
}));
jest.mock('../defaultConfig', () => 'default-config');

beforeEach(() => {
    jest.resetAllMocks();
});

const name = 'swaggerlint-core';

describe('cli function', () => {
    it('exits when neither url nor swaggerPath are passed', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils');

        getConfig.mockReturnValueOnce('lookedup-config');

        const result = await cli({});

        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(getConfig.mock.calls).toEqual([[undefined]]);

        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    name,
                    msg:
                        'Neither url nor path were provided for your swagger scheme',
                },
            ],
        });
    });

    it('exits when passed config path does not exist', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils');

        getConfig.mockReturnValueOnce(null);

        const config = 'lol/kek/foo/bar';
        const result = await cli({config});

        expect(getConfig.mock.calls).toEqual([[config]]);
        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    msg:
                        'Swaggerlint config with a provided path does not exits.',
                    name,
                },
            ],
        });
    });

    it('exits when could not locate the config', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils');

        getConfig.mockReturnValueOnce(null);

        const result = await cli({});

        expect(getConfig.mock.calls.length === 1).toBe(true);
        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    msg: 'Could not find swaggerlint.config.js file',
                    name,
                },
            ],
        });
    });

    it('exits when passed path to swagger does not exist', async () => {
        const {swaggerlint} = require('../index');
        const {getConfig} = require('../utils');
        const fs = require('fs');

        getConfig.mockReturnValueOnce('lookedup-config');
        fs.existsSync.mockReturnValueOnce(false);

        const path = 'lol/kek/foo/bar';
        const result = await cli({path});

        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    msg: 'File with a provided path does not exist.',
                    name,
                },
            ],
        });
    });

    it('exits when cannot fetch from passed url', async () => {
        const {swaggerlint} = require('../index');
        const {fetchUrl} = require('../utils');

        fetchUrl.mockImplementation(() => Promise.reject(null));

        const url = 'https://lol.org/openapi';
        const result = await cli({url});

        expect(fetchUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls.length === 0).toBe(true);
        expect(result).toEqual({
            code: 1,
            errors: [
                {
                    msg: 'Cannot fetch swagger scheme from the provided url',
                    name,
                },
            ],
        });
    });

    it('returns code 0 when no errors are found', async () => {
        const {swaggerlint} = require('../index');
        const {fetchUrl, getConfig} = require('../utils');

        getConfig.mockReturnValueOnce('lookedup-config');
        swaggerlint.mockImplementation(() => []);
        fetchUrl.mockImplementation(() => Promise.resolve({}));

        const url = 'https://lol.org/openapi';
        const result = await cli({url});

        expect(fetchUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls).toEqual([[{}, 'lookedup-config']]);
        expect(result).toEqual({
            code: 0,
            errors: [],
        });
    });

    it('returns code 1 when errors are found', async () => {
        const {swaggerlint} = require('../index');
        const {fetchUrl, getConfig} = require('../utils');
        const errors = [{name: 'foo', msg: 'bar'}];

        getConfig.mockReturnValueOnce('lookedup-config');
        swaggerlint.mockImplementation(() => errors);
        fetchUrl.mockImplementation(() => Promise.resolve({}));

        const url = 'https://lol.org/openapi';
        const result = await cli({url});

        expect(fetchUrl.mock.calls).toEqual([[url]]);
        expect(swaggerlint.mock.calls).toEqual([[{}, 'lookedup-config']]);
        expect(result).toEqual({
            code: 1,
            errors,
        });
    });
});
