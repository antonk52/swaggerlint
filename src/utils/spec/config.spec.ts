import {getConfig, resolveConfigExtends} from '../config';
import {SwaggerlintConfig} from '../../types';
import {cosmiconfigSync} from 'cosmiconfig';

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
jest.mock('path', () => ({
    resolve: (filepath: string) => filepath,
    join: (...args: string[]) => args.join('/'),
}));

jest.mock('case', () => ({
    rules: {
        case: true,
    },
}));

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
            const config = {rules: {userRule: true}};

            (cosmiconfigSync as jest.Mock).mockImplementationOnce(() => ({
                load: (): {config: SwaggerlintConfig} => ({config}),
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
                type: 'success',
            };

            expect(result).toEqual(expected);
        });

        it('returns an error if provided path does not exist', () => {
            (cosmiconfigSync as jest.Mock).mockImplementationOnce(() => ({
                load: (): unknown => null,
            }));

            const result = getConfig('./some-path');

            expect(result.type).toBe('fail');
        });

        it('returns an error if loaded config did not pass validation', () => {
            (cosmiconfigSync as jest.Mock).mockImplementationOnce(() => ({
                load: (
                    filepath: string,
                ): {config: object; filepath: string} => ({
                    config: {extends: [null, 'foo']},
                    filepath,
                }),
            }));

            const result = getConfig('./some-path');

            expect(result).toEqual({
                type: 'error',
                filepath: './some-path',
                error: 'Expected string at ".extends[0]", got `null`',
            });
        });

        it('returns an error if found config did not pass validation', () => {
            (cosmiconfigSync as jest.Mock).mockImplementationOnce(() => ({
                search: (): {config: object; filepath: string} => ({
                    config: {extends: [null, 'foo']},
                    filepath: './some-path',
                }),
            }));

            const result = getConfig();

            expect(result).toEqual({
                type: 'error',
                filepath: './some-path',
                error: 'Expected string at ".extends[0]", got `null`',
            });
        });

        it('returns config by searching for it', () => {
            const config = {rules: {userRule: true}};
            const search = jest.fn((): {
                config: SwaggerlintConfig;
                filepath: string;
            } => ({
                config,
                filepath: 'foo/bar',
            }));

            (cosmiconfigSync as jest.Mock).mockImplementationOnce(() => ({
                search,
            }));

            const result = getConfig();
            const expected = {
                type: 'success',
                filepath: 'foo/bar',
                config: {
                    rules: {
                        ...config.rules,
                        defaultRule: true,
                    },
                    ignore: {},
                    extends: [],
                },
            };

            expect(result).toEqual(expected);
            expect(result).toEqual(expected);
            expect(search.mock.calls).toHaveLength(1);
        });

        it('finds and resolves config with extends field', () => {
            (cosmiconfigSync as jest.Mock).mockReturnValueOnce({
                search: jest.fn(() => ({
                    config: {rules: {a: true}, extends: ['case']},
                    filepath: 'some/valid/path/a.config.js',
                })),
            });
            const result = getConfig();

            const expected = {
                type: 'success',
                config: {
                    extends: [],
                    ignore: {},
                    rules: {
                        a: true,
                        case: true,
                        defaultRule: true,
                    },
                },
                filepath: 'some/valid/path/a.config.js',
            };

            expect(result).toEqual(expected);
        });

        it('returns defaultConfig if could not find a config', () => {
            const search = jest.fn(() => null);

            (cosmiconfigSync as jest.Mock).mockImplementationOnce(() => ({
                search,
            }));

            const result = getConfig();

            expect(search.mock.calls).toHaveLength(1);
            expect(result.type).toBe('success');
        });
    });
});
