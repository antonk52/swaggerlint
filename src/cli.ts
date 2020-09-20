import {swaggerlint} from './swaggerlint';
import {
    LintError,
    CliOptions,
    CliResult,
    EntryResult,
    Swagger,
    OpenAPI,
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

    let schema: void | Swagger.SwaggerObject | OpenAPI.OpenAPIObject;

    const configResult = getConfig(opts.config);
    if (configResult.type === 'fail') {
        return {
            code: 1,
            results: [preLintError({msg: configResult.error, src: ''})],
        };
    }

    if (configResult.type === 'error') {
        return {
            code: 1,
            results: [
                preLintError({
                    msg: configResult.error,
                    src: configResult.filepath,
                }),
            ],
        };
    }

    const {config} = configResult;

    const result: Promise<EntryResult>[] = opts._.map(async schemaPath => {
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
