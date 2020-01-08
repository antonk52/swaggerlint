#!/usr/bin/env node

import minimist from 'minimist';
import {cli} from './cli';
import {logErrors} from './utils/output';
import {CliOptions} from './types';
import {green} from 'kleur';
const pkg = require('../package.json');

function program() {
    const {version, v, ...options} = minimist<CliOptions>(
        process.argv.slice(2),
    );

    if (version || v) {
        console.log(pkg.version);

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
