#!/usr/bin/env node

import {cli} from './cli';
import {logErrors} from './utils';

cli(process.argv.slice(2)).then(({code, errors}) => {
    if (code === 1) {
        logErrors(errors);
    } else {
        console.log('No errors found');
    }

    process.exit(code);
});
