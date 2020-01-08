import {swaggerlint} from './index';
import {LintError, CliOptions, CliResult, SwaggerObject} from './types';
import defaultConfig from './defaultConfig';
import {log, fetchUrl, isYamlPath, getConfig} from './utils';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const name = 'swaggerlint-core';

function preLintError(msg: string): CliResult {
    return {
        code: 1,
        errors: [{name, msg, location: []}],
        swagger: undefined,
    };
}

export async function cli(opts: CliOptions): Promise<CliResult> {
    let errors: LintError[] = [];

    let config = defaultConfig;
    let swagger: void | SwaggerObject;
    const loadedConfig = getConfig(opts.config);
    if (loadedConfig === null) {
        return preLintError(
            typeof opts.config === 'string'
                ? 'Swaggerlint config with a provided path does not exits.'
                : 'Could not find swaggerlint.config.js file',
        );
    } else {
        config = loadedConfig;
    }

    const [urlOrPath] = opts._;

    if (!urlOrPath) {
        return preLintError(
            'Neither url nor path were provided for your swagger scheme',
        );
    }

    /**
     * handling `swagger-lint https://...`
     */
    if (urlOrPath.startsWith('http')) {
        const url = urlOrPath;
        log(`fetching for ${url}`);
        const swaggerFromUrl: SwaggerObject | null = await fetchUrl(url).catch(
            e => {
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
            swagger = Object.freeze(swaggerFromUrl);
            errors = swaggerlint(swaggerFromUrl, config);
        }
    } else {
        /**
         * handling `swagger-lint /path/to/swagger.json`
         */
        const swaggerPath = path.resolve(urlOrPath);

        // non existing path
        if (!fs.existsSync(swaggerPath)) {
            return preLintError('File at the provided path does not exist.');
        }

        const isYaml = isYamlPath(swaggerPath);

        const swaggerFromPath: SwaggerObject = isYaml
            ? yaml.safeLoad(fs.readFileSync(swaggerPath, 'utf8'))
            : require(swaggerPath);
        swagger = Object.freeze(swaggerFromPath);

        errors = swaggerlint(swaggerFromPath, config);
    }

    return {
        errors,
        code: errors.length ? 1 : 0,
        swagger,
    };
}
