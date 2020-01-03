import {Config} from './types';

const config: Config = {
    rules: {
        'latin-definitions-only': [],
        'no-empty-object-type': [],
        'no-single-allof': [],
        'object-prop-casing': ['camel'],
    },
    ignore: {
        definitions: [],
    },
};

export default config;
