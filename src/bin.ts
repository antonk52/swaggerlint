#!/usr/bin/env node

import minimist from 'minimist';
import {cli} from './cli';
import {logErrors} from './utils';
import {CliOptions} from './types';
const pkg = require('../package.json');

function program() {
    const {version, ...options} = minimist<CliOptions>(process.argv.slice(2));

    if (version) {
        console.log(pkg.version);

        process.exit(0);
    }

    cli(options).then(({code, errors}) => {
        if (code === 1) {
            logErrors(errors);
        } else {
            console.log('No errors found');
        }

        process.exit(code);
    });
}

program();
