import {swaggerlint} from './swaggerlint';
import {LintError, CliOptions, CliResult, Swagger, OpenAPI} from './types';
import {getConfig} from './utils/config';
import {getSwaggerByPath, getSwaggerByUrl} from './utils/swaggerfile';
import {log} from './utils';

const name = 'swaggerlint-core';

function preLintError({src, msg}: {src: string; msg: string}): CliResult {
    return {
        src,
        code: 1,
        errors: [{name, msg, location: []}],
        schema: undefined,
    };
}

export async function cli(opts: CliOptions): Promise<CliResult[]> {
    let schema: void | Swagger.SwaggerObject | OpenAPI.OpenAPIObject;

    const {config, error: configError} = getConfig(opts.config);
    if (configError) {
        return [preLintError({msg: configError, src: ''})];
    }

    if (opts._.length === 0) {
        return [
            preLintError({
                msg:
                    'Neither url nor path were provided for your swagger scheme',
                src: '',
            }),
        ];
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
            return [
                preLintError({
                    msg: 'Every value in `extends` has to be a string',
                    src: '', // TODO get config path
                }),
            ];
        }
    }

    const schemaPaths = opts._.reduce((acc, schemaPath) => {
        acc.push(schemaPath);
        return acc;
    }, [] as string[]);

    const result: Promise<CliResult>[] = schemaPaths.map(async schemaPath => {
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

                const res: CliResult = {
                    src: url,
                    schema,
                    errors,
                    code: errors.length ? 1 : 0,
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

            const res: CliResult = {
                src: schemaPath,
                errors,
                code: errors.length ? 1 : 0,
                schema: Object.freeze(result.swagger),
            };

            return res;
        }
    });

    return Promise.all(result);
}
