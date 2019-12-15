#!/usr/bin/env node

import {cli} from '../src/cli';
import {logErrors} from '../src/utils';

cli().then(({code, errors}) => {
    if (code === 1 && errors.length === 0) {
        console.error('neither url nor path is passed');
    } else if (code === 1) {
        logErrors(errors);
    } else {
        console.log('No errors found');
    }

    process.exit(code);
});
