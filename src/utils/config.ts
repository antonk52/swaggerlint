import path from 'path';
import {cosmiconfigSync} from 'cosmiconfig';
import {SwaggerlintConfig} from '../types';
import defaultConfig from '../defaultConfig';
const pkg = require('../../package.json');

function mergeConfigs(
    defConf: SwaggerlintConfig,
    userConf: SwaggerlintConfig,
): SwaggerlintConfig {
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
}: SwaggerlintConfig): Omit<SwaggerlintConfig, 'extends'> {
    return rest;
}

type ConfigWithExtends = SwaggerlintConfig & {extends: string[]};
type ConfigNoExtends = Omit<SwaggerlintConfig, 'extends'>;

export function resolveConfigExtends(
    baseConfig: ConfigWithExtends,
): SwaggerlintConfig {
    const processedConfigs = new Set<string>([]);
    const toBeMergedConfigs: ConfigNoExtends[] = [omitExtends(baseConfig)];

    function resolveExtends(conf: ConfigWithExtends): void {
        [...conf.extends].reverse().forEach(function resolveEachName(name) {
            if (typeof name !== 'string') {
                throw 'Every item in "extends" has to be a string.';
            }
            let resolvedName;
            try {
                resolvedName = require.resolve(name);
            } catch (e) {
                if (e.code && e.code === 'MODULE_NOT_FOUND') {
                    throw `"${name}" in extends of your config cannot be found. Make sure it exists in your node_modules.`;
                } else {
                    throw e;
                }
            }
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
    const result = toBeMergedConfigs.reduce<SwaggerlintConfig>(
        (acc, conf) => mergeConfigs(acc, conf),
        defaultConfig,
    );

    return result;
}

type GetConfigSuccess = {
    type: 'success';
    config: SwaggerlintConfig;
    filepath: string;
};
type GetConfigFail = {
    type: 'fail';
    error: string;
};

type GetConfigResult = GetConfigSuccess | GetConfigFail;

const defaultConfigPath = path.join(__dirname, '..', 'defaultConfig.js');
export function getConfig(configPath: string | void): GetConfigResult {
    const cosmiconfig = cosmiconfigSync(pkg.name);
    if (configPath) {
        const cosmiResult = cosmiconfig.load(path.resolve(configPath));

        if (cosmiResult?.config) {
            const config = cosmiResult.config.extends
                ? resolveConfigExtends(cosmiResult.config)
                : mergeConfigs(defaultConfig, cosmiResult.config);

            return {
                type: 'success',
                config,
                filepath: cosmiResult.filepath,
            };
        } else {
            return {
                type: 'fail',
                error:
                    'Swaggerlint config with a provided path does not exits.',
            };
        }
    } else {
        const cosmiResult = cosmiconfig.search();
        const lookedupConfig = cosmiResult?.config;

        if (cosmiResult?.config) {
            if (cosmiResult.config.extends) {
                try {
                    return {
                        type: 'success',
                        config: resolveConfigExtends(lookedupConfig),
                        filepath: cosmiResult.filepath,
                    };
                } catch (e) {
                    return {
                        type: 'fail',
                        error: e,
                    };
                }
            } else {
                return {
                    type: 'success',
                    config: mergeConfigs(defaultConfig, lookedupConfig),
                    filepath: cosmiResult.filepath,
                };
            }
        } else {
            return {
                type: 'success',
                config: defaultConfig,
                filepath: defaultConfigPath,
            };
        }
    }
}
