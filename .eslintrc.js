module.exports = {
    root: true,
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
    ],
    plugins: [
        '@typescript-eslint',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    rules: {
        indent: ['error', 4, { "SwitchCase": 1 }],
        '@typescript-eslint/no-var-requires': 0,
    },
    overrides: [
        {
            files: ['src/**/*.spec.*'],
            rules: {
                '@typescript-eslint/ban-ts-ignore': 0,
            },
        },
    ],
};
