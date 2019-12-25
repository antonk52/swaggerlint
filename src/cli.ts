import {swaggerlint} from './index';
import {LintError} from './types';
import defaultConfig from './defaultConfig';
import {log, fetchUrl, isYamlPath, getConfig} from './utils';
import fs from 'fs';
import yaml from 'js-yaml';

type ExitCode = 0 | 1;
type CliResult = {
    code: ExitCode;
    errors: LintError[];
};

const name = 'swaggerlint-core';

function preLintError(msg: string): CliResult {
    return {
        code: 1,
        errors: [{name, msg}],
    };
}

export async function cli(args: string[]): Promise<CliResult> {
    let errors: LintError[] = [];

    let config = defaultConfig;

    const passedConfigPath = args.includes('--config')
        ? args[args.indexOf('--config') + 1]
        : undefined;

    const loadedConfig = getConfig(passedConfigPath);

    if (loadedConfig === null) {
        return preLintError(
            passedConfigPath
                ? 'Swaggerlint config with a provided path does not exits.'
                : 'Could not find swaggerlint.config.js file',
        );
    } else {
        config = loadedConfig;
    }

    let url: string | null = null;
    const urlFlagIndex = args.indexOf('--url');

    if (urlFlagIndex !== -1) {
        url = args[urlFlagIndex + 1];
    }

    /**
     * handling `swagger-lint --url https://...`
     */
    if (url) {
        log(`fetching for ${url}`);
        const swagger = await fetchUrl(url).catch(e => {
            log('error fetching url');
            log(e);

            return null;
        });
        if (swagger === null) {
            return preLintError(
                'Cannot fetch swagger scheme from the provided url',
            );
        } else {
            log(`got response`);
            errors = swaggerlint(swagger, config);
        }
    }

    let swaggerPath: string | null = null;
    const pathFlagIndex = args.indexOf('--path');

    if (pathFlagIndex !== -1) {
        swaggerPath = args[pathFlagIndex + 1];
    }

    /**
     * handling `swagger-lint --path /path/to/swagger.json`
     */
    if (swaggerPath) {
        // non existing path
        if (!fs.existsSync(swaggerPath)) {
            return preLintError('File with a provided path does not exist.');
        }

        const isYaml = isYamlPath(swaggerPath);

        const swagger = isYaml
            ? yaml.safeLoad(fs.readFileSync(swaggerPath, 'utf8'))
            : require(swaggerPath);

        errors = swaggerlint(swagger, config);
    }

    if (!(url || swaggerPath)) {
        return preLintError(
            'Neither url nor path were provided for your swagger scheme',
        );
    }

    return {
        errors,
        code: errors.length ? 1 : 0,
    };
}
