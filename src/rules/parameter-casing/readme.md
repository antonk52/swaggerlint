# parameter-casing rule

By default this rule is checking for all parameters to be `camel` cased. Optionally you can specify one of other supported casing names `camel | constant | snake | kebab | pascal`.

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'parameter-casing': ['snake'],
    },
};
```


This rule can be configured to check for different casing depending on parameter location (`in`), ie `query | header | path | formData | body`. You can also specify parameter names to ignore.

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'parameter-casing': [
            'camel', // default casing
            {
                query: 'snake', // override specific parameters
                header: 'kebab',
                path: 'pascal',
                formData: 'constant',
                body: 'camel',
                ignore: ['ODD', 'cAsinG'], // parameter names to ignore
            },
        ],
    },
};
```
