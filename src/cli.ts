import type {JSONSchema7} from 'json-schema';
import {validate} from './utils/validate-json';
import {swaggerlint} from './swaggerlint';
import {
    LintError,
    CliOptions,
    CliResult,
    EntryResult,
    Swagger,
    OpenAPI,
    SwaggerlintConfig,
} from './types';
import {getConfig} from './utils/config';
import {getSwaggerByPath, getSwaggerByUrl} from './utils/swaggerfile';
import {log} from './utils';

const name = 'swaggerlint-core';

function preLintError({src, msg}: {src: string; msg: string}): EntryResult {
    return {
        src,
        errors: [{name, msg, location: []}],
        schema: undefined,
    };
}

export async function cli(opts: CliOptions): Promise<CliResult> {
    let schema: void | Swagger.SwaggerObject | OpenAPI.OpenAPIObject;

    const configResult = getConfig(opts.config);
    if (configResult.type === 'fail') {
        return {
            code: 1,
            results: [preLintError({msg: configResult.error, src: ''})],
        };
    }

    const {config, filepath: configFilepath} = configResult;

    const configErrors = validateConfig(configResult.config);

    if (configErrors.length) {
        return {
            results: [
                {
                    src: configFilepath,
                    errors: configErrors,
                    schema: undefined,
                },
            ],
            code: 1,
        };
    }

    if (opts._.length === 0) {
        return {
            code: 1,
            results: [
                preLintError({
                    msg:
                        'Neither url nor path were provided for your swagger scheme',
                    src: '',
                }),
            ],
        };
    }

    /**
     * validate config.extends
     */
    if (
        'extends' in config &&
        config.extends &&
        Array.isArray(config.extends)
    ) {
        if (!config.extends.every(e => typeof e === 'string')) {
            return {
                code: 1,
                results: [
                    preLintError({
                        msg: 'Every value in `extends` has to be a string',
                        src: configFilepath,
                    }),
                ],
            };
        }
    }

    const schemaPaths = opts._.reduce((acc, schemaPath) => {
        acc.push(schemaPath);
        return acc;
    }, [] as string[]);

    const result: Promise<EntryResult>[] = schemaPaths.map(async schemaPath => {
        /**
         * handling `swagger-lint https://...`
         */
        if (schemaPath.startsWith('http')) {
            const url = schemaPath;
            log(`fetching for ${url}`);
            type FromUrl = Swagger.SwaggerObject | OpenAPI.OpenAPIObject | null;
            const swaggerFromUrl: FromUrl = await getSwaggerByUrl(url).catch(
                (e: string) => {
                    log('error fetching url');
                    log(e);

                    return null;
                },
            );
            if (swaggerFromUrl === null) {
                return preLintError({
                    msg: 'Cannot fetch swagger scheme from the provided url',
                    src: url,
                });
            } else {
                log(`got response`);
                schema = Object.freeze(swaggerFromUrl);
                const errors: LintError[] = swaggerlint(swaggerFromUrl, config);

                const res: EntryResult = {
                    src: url,
                    schema,
                    errors,
                };

                return res;
            }
        } else {
            /**
             * handling `swagger-lint /path/to/swagger.json`
             */
            const result = getSwaggerByPath(schemaPath);

            if ('error' in result) {
                return preLintError({msg: result.error, src: schemaPath});
            }

            const errors: LintError[] = swaggerlint(result.swagger, config);

            const res: EntryResult = {
                src: schemaPath,
                errors,
                schema: Object.freeze(result.swagger),
            };

            return res;
        }
    });

    const results = await Promise.all(result);

    return {
        results,
        code: results.every(x => x.errors.length === 0) ? 0 : 1,
    };
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

export const validateConfig = (config: SwaggerlintConfig) => {
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
        }

        return result;
    });
};
