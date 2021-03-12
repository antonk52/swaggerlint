import {SwaggerlintConfig} from './types';

const config: SwaggerlintConfig = {
    rules: {
        'expressive-path-summary': true,
        'latin-definitions-only': ['', {ignore: []}],
        'no-empty-object-type': true,
        'no-external-refs': false,
        'no-inline-enums': true,
        'no-single-allof': true,
        'no-trailing-slash': true,
        'object-prop-casing': ['camel'],
        'only-valid-mime-types': true,
        'parameter-casing': ['camel', {header: 'kebab'}],
        'required-operation-tags': true,
        'required-parameter-description': true,
        'required-tag-description': true,
    },
};

export default config;
