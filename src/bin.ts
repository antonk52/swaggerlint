#!/usr/bin/env node

import minimist from 'minimist';
import {cli} from './cli';
import {logErrors} from './utils/output';
import {CliOptions} from './types';
import {green} from 'kleur';
const pkg = require('../package.json');

function program() {
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

    cli(options).then(({code, errors, swagger}) => {
        if (code === 1) {
            logErrors(errors, swagger);
        } else {
            console.log(green('No errors found'));
        }

        process.exit(code);
    });
}

program();
