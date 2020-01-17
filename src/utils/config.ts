import path from 'path';
import {cosmiconfigSync} from 'cosmiconfig';
import {Config} from '../types';
import defaultConfig from '../defaultConfig';
const pkg = require('../../package.json');

function mergeConfigs(defConf: Config, userConf: Config): Config {
    return {
        extends: [...(defConf.extends ?? []), ...(userConf.extends ?? [])],
        rules: {
            ...defConf.rules,
            ...userConf.rules,
        },
        ignore: {
            ...userConf.ignore,
        },
    };
}

// workaround for extends keyword
function omitExtends({
    /* eslint-disable @typescript-eslint/no-unused-vars */
    extends: ext,
    ...rest
}: Config): Omit<Config, 'extends'> {
    return rest;
}

type ConfigWithExtends = Config & {extends: string[]};
type ConfigNoExtends = Omit<Config, 'extends'>;

export function resolveConfigExtends(baseConfig: ConfigWithExtends): Config {
    const processedConfigs = new Set<string>([]);
    const toBeMergedConfigs: ConfigNoExtends[] = [omitExtends(baseConfig)];

    function resolveExtends(conf: ConfigWithExtends): void {
        [...conf.extends].reverse().forEach(name => {
            const resolvedName = require.resolve(name);
            if (processedConfigs.has(resolvedName)) return;
            processedConfigs.add(resolvedName);
            const nextConf = require(name);

            if (nextConf.extends) resolveExtends(nextConf);

            toBeMergedConfigs.unshift(nextConf);
        });
    }

    resolveExtends(baseConfig);

    /**
     * default config is always the base of any config
     */
    const result = toBeMergedConfigs.reduce<Config>(
        (acc, conf) => mergeConfigs(acc, conf),
        defaultConfig,
    );

    return result;
}

type GetConfigResult = {
    config: Config;
    error: null | string;
};

export function getConfig(configPath: string | void): GetConfigResult {
    const cosmiconfig = cosmiconfigSync(pkg.name);
    if (configPath) {
        const cosmiResult = cosmiconfig.load(path.resolve(configPath));
        const loadedConfig = cosmiResult?.config;

        if (loadedConfig) {
            const config = loadedConfig.extends
                ? resolveConfigExtends(loadedConfig)
                : mergeConfigs(defaultConfig, loadedConfig);

            return {
                config,
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
        const cosmiResult = cosmiconfig.search();
        const lookedupConfig = cosmiResult?.config;

        if (lookedupConfig) {
            const config = lookedupConfig.extends
                ? resolveConfigExtends(lookedupConfig)
                : mergeConfigs(defaultConfig, lookedupConfig);

            return {
                config,
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
