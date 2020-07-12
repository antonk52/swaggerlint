#!/usr/bin/env node

import minimist from 'minimist';
import {cli} from './cli';
import {logErrors, logErrorCount} from './utils/output';
import {CliOptions} from './types';
import {green} from 'kleur';
const pkg = require('../package.json');

function program(): void {
    const {version, v, help, h, ...options} = minimist<CliOptions>(
        process.argv.slice(2),
    );

    if (version || v) {
        console.log(pkg.version);

        process.exit(0);
    }

    if (help || h) {
        console.log(
            `

swaggerlint version ${pkg.version}
<${pkg.repository.url.replace('git+', '').replace('.git', '')}>
swaggerlint is a program to lint swagger (OpenAPI v2.0) API specification.

Usage:
    swaggerlint ./path/to/swagger/file.json
    swaggerlint http://url.to/swagger/file.yml

Options:
 -v, --version              print version number
 -h, --help                 show this help
 --config                   add user config (swaggerlint.config.js)

            `.trim(),
        );
        process.exit(0);
    }

    cli(options).then(results => {
        const exitCode = results.every(x => x.code === 0) ? 0 : 1;

        if (results.length > 1) {
            results.forEach(result => {
                logErrors(result.errors, result.schema, {
                    filename: result.src,
                    count: false,
                });
            });
            logErrorCount(
                results.reduce((acc, el) => acc + el.errors.length, 0),
            );
        } else {
            const {code, errors, schema} = results[0];

            if (code === 1) {
                logErrors(errors, schema, {count: true});
            } else {
                console.log(green('No errors found'));
            }
        }

        process.exit(exitCode);
    });
}

program();
