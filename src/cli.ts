import {swaggerlint} from './index';
import {LintError} from './types';
import defaultConfig from './defaultConfig';
import {log, fetchUrl, isYamlPath} from './utils';
import fs from 'fs';
import yaml from 'js-yaml';

type ExitCode = 0 | 1;
type CliResult = {
    code: ExitCode;
    errors: LintError[];
};

const name = 'swaggerlint-core';

export async function cli(args: string[]): Promise<CliResult> {
    let errors: LintError[] = [];

    let config = defaultConfig;
    const configFlagIndex = args.indexOf('--config');

    if (configFlagIndex !== -1) {
        const configPath = args[configFlagIndex + 1];

        if (fs.existsSync(configPath)) {
            config = require(configPath);
        } else {
            return {
                code: 1,
                errors: [
                    {
                        name,
                        msg: 'File at a provided config path does not exist.',
                    },
                ],
            };
        }
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
            return {
                code: 1,
                errors: [
                    {
                        name,
                        msg:
                            'Cannot fetch swagger scheme from the provided url',
                    },
                ],
            };
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
            return {
                code: 1,
                errors: [
                    {
                        msg: 'File with a provided path does not exits.',
                        name,
                    },
                ],
            };
        }

        const isYaml = isYamlPath(swaggerPath);

        const swagger = isYaml
            ? yaml.safeLoad(fs.readFileSync(swaggerPath, 'utf8'))
            : require(swaggerPath);

        errors = swaggerlint(swagger, config);
    }

    if (!(url || swaggerPath)) {
        return {
            errors: [
                {
                    name,
                    msg:
                        'Neither url nor path were provided for your swagger scheme',
                },
            ],
            code: 1,
        };
    }

    return {
        errors,
        code: errors.length ? 1 : 0,
    };
}
