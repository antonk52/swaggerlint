import {resolveConfigExtends} from '../config';

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
});
