import {stylelintSwagger} from './index';
import config from './sample-config';
import {log, fetchUrl, logErrors} from './utils';

async function binSwaggerLint() {
    const args: string[] = process.argv;

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
            log(`error fetching url, exiting...`);
            log(e);
            process.exit(1);
        });
        log(`got response`);
        const errors = stylelintSwagger(swagger, config);
        logErrors(errors);
        if (errors.length) return process.exit(1);
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
        // TODO check if exists, valid, convert from yaml to json
        const swagger = require(swaggerPath);
        const errors = stylelintSwagger(swagger, config);
        logErrors(errors);
        if (errors.length) return process.exit(1);
    }
}

binSwaggerLint();
