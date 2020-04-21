import {swaggerlint} from './swaggerlint';
import {LintError, CliOptions, CliResult, Swagger, OpenAPI} from './types';
import {getConfig} from './utils/config';
import {getSwaggerByPath, getSwaggerByUrl} from './utils/swaggerfile';
import {log} from './utils';

const name = 'swaggerlint-core';

function preLintError(msg: string): CliResult {
    return {
        code: 1,
        errors: [{name, msg, location: []}],
        schema: undefined,
    };
}

export async function cli(opts: CliOptions): Promise<CliResult> {
    let errors: LintError[] = [];
    let schema: void | Swagger.SwaggerObject | OpenAPI.OpenAPIObject;

    const {config, error: configError} = getConfig(opts.config);
    if (configError) {
        return preLintError(configError);
    }

    const [urlOrPath] = opts._;
    if (!urlOrPath) {
        return preLintError(
            'Neither url nor path were provided for your swagger scheme',
        );
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
            return preLintError('Every value in `extends` has to be a string');
        }
    }

    /**
     * handling `swagger-lint https://...`
     */
    if (urlOrPath.startsWith('http')) {
        const url = urlOrPath;
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
            return preLintError(
                'Cannot fetch swagger scheme from the provided url',
            );
        } else {
            log(`got response`);
            schema = Object.freeze(swaggerFromUrl);
            errors = swaggerlint(swaggerFromUrl, config);
        }
    } else {
        /**
         * handling `swagger-lint /path/to/swagger.json`
         */
        const result = getSwaggerByPath(urlOrPath);

        if ('error' in result) {
            return preLintError(result.error);
        }

        schema = Object.freeze(result.swagger);
        errors = swaggerlint(result.swagger, config);
    }

    return {
        errors,
        code: errors.length ? 1 : 0,
        schema,
    };
}
