import path from 'path';
import {cosmiconfigSync} from 'cosmiconfig';
import {Config} from '../types';
import defaultConfig from '../defaultConfig';
const pkg = require('../../package.json');

function mergeConfigs(defConf: Config, userConf: Config): Config {
    return {
        rules: {
            ...defConf.rules,
            ...userConf.rules,
        },
        ignore: {
            ...userConf.ignore,
        },
    };
}

type GetConfigResult = {
    config: Config;
    error: null | string;
};

export function getConfig(configPath: string | void): GetConfigResult {
    const cosmiconfig = cosmiconfigSync(pkg.name);
    if (configPath) {
        const loadedConfig = cosmiconfig.load(path.resolve(configPath))?.config;

        if (loadedConfig) {
            return {
                config: mergeConfigs(defaultConfig, loadedConfig),
                error: null,
            };
        } else {
            return {
                config: defaultConfig,
                error:
                    'Swaggerlint config with a provided path does not exits.',
            };
        }
    } else {
        const lookedupConfig = cosmiconfig.search()?.config;

        if (lookedupConfig) {
            return {
                config: mergeConfigs(defaultConfig, lookedupConfig),
                error: null,
            };
        } else {
            return {
                config: defaultConfig,
                error: null,
            };
        }
    }
}
