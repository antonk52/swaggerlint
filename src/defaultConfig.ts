import {Config} from './types';

const config: Config = {
    rules: {
        'expressive-path-summary': true,
        'latin-definitions-only': true,
        'required-operation-tags': true,
        'required-parameter-description': true,
        'required-tag-description': true,
        'no-empty-object-type': true,
        'no-single-allof': true,
        'no-trailing-slash': true,
        'object-prop-casing': ['camel'],
    },
};

export default config;
