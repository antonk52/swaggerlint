import {getConfig, resolveConfigExtends} from '../config';

jest.mock('cosmiconfig', () => ({
    cosmiconfigSync: jest.fn(),
}));
jest.mock('../../defaultConfig', () => ({rules: {defaultRule: true}}));
/**
 * jest does not support mocking non existing packages/files
 * let's pretend the followings are swaggerlint config packages
 */
jest.mock('fs', () => ({extends: ['os'], rules: {fs: true}}));
jest.mock('os', () => ({extends: ['process'], rules: {os: true}}));
jest.mock('process', () => ({extends: ['fs'], rules: {process: true}}));

jest.mock('http', () => ({rules: {http: true}}));
jest.mock('https', () => ({rules: {http: false, https: true}}));

describe('utils/config', () => {
    describe('resolveConfigExtends function', () => {
        it('resolves config with single extends value', () => {
            const result = resolveConfigExtends({
                extends: ['http'],
                rules: {},
            });

            expect(result.rules.http).toBe(true);
        });

        it('resolves config with cyclic dependent extends', () => {
            const result = resolveConfigExtends({
                extends: ['fs', 'http'],
                rules: {},
            });
            const expected = {
                rules: {
                    fs: true,
                    os: true,
                    process: true,
                    http: true,
                },
            };

            expect(result.rules).toMatchObject(expected.rules);
        });

        it('configs are merged left to right', () => {
            const result = resolveConfigExtends({
                extends: ['http', 'https'],
                rules: {},
            });

            expect(result.rules.http).toBe(false);
            expect(result.rules.https).toBe(true);
        });

        it('throws when extending from non existing config', () => {
            expect(() =>
                resolveConfigExtends({
                    extends: ['foobar'],
                    rules: {},
                }),
            ).toThrowError(
                '"foobar" in extends of your config cannot be found. Make sure it exists in your node_modules.',
            );
        });
    });
    describe('getConfig function', () => {
        it('returns config by path', () => {
            const {cosmiconfigSync} = require('cosmiconfig');
            const config = {rules: {userRule: true}};

            cosmiconfigSync.mockImplementationOnce(() => ({
                load: () => ({config}),
            }));

            const result = getConfig('./some-path');
            const expected = {
                config: {
                    rules: {
                        ...config.rules,
                        defaultRule: true,
                    },
                    ignore: {},
                    extends: [],
                },
                error: null,
            };

            expect(result).toEqual(expected);
        });

        it('returns an error if provided path does not exist', () => {
            const {cosmiconfigSync} = require('cosmiconfig');

            cosmiconfigSync.mockImplementationOnce(() => ({
                load: () => ({config: null}),
            }));

            const result = getConfig('./some-path');

            expect(typeof result.error).toBe('string');
        });

        it('returns config by searching for it', () => {
            const {cosmiconfigSync} = require('cosmiconfig');
            const config = {rules: {userRule: true}};
            const search = jest.fn(() => ({config}));

            cosmiconfigSync.mockImplementationOnce(() => ({search}));

            const result = getConfig();
            const expected = {
                config: {
                    rules: {
                        ...config.rules,
                        defaultRule: true,
                    },
                    ignore: {},
                    extends: [],
                },
                error: null,
            };

            expect(result).toEqual(expected);
            expect(result).toEqual(expected);
            expect(search.mock.calls).toHaveLength(1);
        });

        it('returns defaultConfig if could not find a config', () => {
            const {cosmiconfigSync} = require('cosmiconfig');
            const defaultConfig = require('../../defaultConfig');
            const search = jest.fn(() => ({config: null}));

            cosmiconfigSync.mockImplementationOnce(() => ({search}));

            const result = getConfig();

            expect(search.mock.calls).toHaveLength(1);
            expect(result.config).toBe(defaultConfig);
            expect(result.error).toBe(null);
        });
    });
});
