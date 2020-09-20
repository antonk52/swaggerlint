import path from 'path';
import type {JSONSchema7} from 'json-schema';
import {cosmiconfigSync} from 'cosmiconfig';
import {validate} from './validate-json';
import {SwaggerlintConfig, LintError} from '../types';
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
    baseConfig: SwaggerlintConfig,
): SwaggerlintConfig {
    const processedConfigs = new Set<string>([]);
    const toBeMergedConfigs: ConfigNoExtends[] = [omitExtends(baseConfig)];

    function resolveExtends(conf: SwaggerlintConfig): void {
        [...(conf.extends || [])]
            .reverse()
            .forEach(function resolveEachName(name) {
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

const arrayOfStrings: JSONSchema7 = {type: 'array', items: {type: 'string'}};
const configSchema: JSONSchema7 = {
    type: 'object',
    properties: {
        rules: {
            type: 'object',
        },
        extends: arrayOfStrings,
        ignore: {
            type: 'object',
            properties: {
                definitions: arrayOfStrings,
                components: {
                    type: 'object',
                    properties: {
                        schemas: arrayOfStrings,
                        responses: arrayOfStrings,
                        parameters: arrayOfStrings,
                        examples: arrayOfStrings,
                        requestBodies: arrayOfStrings,
                        headers: arrayOfStrings,
                        securitySchemes: arrayOfStrings,
                        links: arrayOfStrings,
                        callbacks: arrayOfStrings,
                    },
                    additionalProperties: false,
                },
            },
            additionalProperties: false,
        },
    },
    additionalProperties: false,
};

const validateConfig = (config: SwaggerlintConfig) => {
    const errors = validate(configSchema, config);

    if (errors.length === 0) return [];

    return errors.map(se => {
        const result: LintError = {
            name: 'swaggerlint-core',
            msg: 'Invalid config',
            location: [],
        };
        switch (se.keyword) {
            case 'additionalProperties':
                const key =
                    'additionalProperty' in se.params &&
                    se.params.additionalProperty;
                result.msg = `Unexpected property ${JSON.stringify(
                    key || '',
                )} in swaggerlint.config.js`;
                break;
            case 'type':
                result.msg = `${(se.message || '').replace(
                    'should be',
                    'Expected',
                )} at "${se.dataPath}", got \`${se.data}\``;
        }

        return result;
    });
};

type GetConfigSuccess = {
    type: 'success';
    config: SwaggerlintConfig;
    filepath: string;
};
type GetConfigFail = {
    type: 'fail';
    error: string;
};

type GetConfigError = {
    type: 'error';
    filepath: string;
    error: string;
};

type GetConfigResult = GetConfigSuccess | GetConfigFail | GetConfigError;

const defaultConfigPath = path.join(__dirname, '..', 'defaultConfig.js');
export function getConfig(configPath: string | void): GetConfigResult {
    const cosmiconfig = cosmiconfigSync(pkg.name);
    if (configPath) {
        const cosmiResult = cosmiconfig.load(path.resolve(configPath));

        if (cosmiResult !== null) {
            const validationErrros = validateConfig(cosmiResult.config);
            if (validationErrros.length) {
                return {
                    type: 'error',
                    filepath: cosmiResult.filepath,
                    error: validationErrros[0].msg,
                };
            }

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

        if (cosmiResult !== null) {
            const validationErrros = validateConfig(cosmiResult.config);
            if (validationErrros.length) {
                return {
                    type: 'error',
                    filepath: cosmiResult.filepath,
                    error: validationErrros[0].msg,
                };
            }

            if (cosmiResult.config.extends) {
                try {
                    return {
                        type: 'success',
                        config: resolveConfigExtends(cosmiResult.config),
                        filepath: cosmiResult.filepath,
                    };
                } catch (e) {
                    return {
                        type: 'error',
                        error: e,
                        filepath: cosmiResult.filepath,
                    };
                }
            } else {
                return {
                    type: 'success',
                    config: mergeConfigs(defaultConfig, cosmiResult.config),
                    filepath: cosmiResult.filepath,
                };
            }
        } else {
            /**
             * if no config is found we use default config
             * reasoning: cli should work out of the box
             */
            return {
                type: 'success',
                config: defaultConfig,
                filepath: defaultConfigPath,
            };
        }
    }
}
