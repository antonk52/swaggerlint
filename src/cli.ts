import {swaggerlint} from './index';
import {LintError} from './types';
import config from './sample-config';
import {log, fetchUrl, isYamlPath} from './utils';
import fs from 'fs';
import yaml from 'js-yaml';

type ExitCode = 0 | 1;
type CliResult = {
    code: ExitCode;
    errors: LintError[];
};

export async function cli(): Promise<CliResult> {
    const args: string[] = process.argv;
    let errors: LintError[] = [];

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
            console.warn('error fetching by URL');
            log(`error fetching url, exiting...`);
            log(e);
            process.exit(1);
        });
        log(`got response`);
        errors = swaggerlint(swagger, config);
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
                        name: 'swaggerlint-core',
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
            errors,
            code: 1,
        };
    }

    return {
        errors,
        code: errors.length ? 1 : 0,
    };
}
