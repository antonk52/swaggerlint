# object-prop-casing rule

By default this rule is checking for all properties of `SchemaObject` with `type: 'object'` to be `camel` cased. Optionally you can specify one of other supported casing names `camel | constant | snake | kebab | pascal`.

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'object-prop-casing': ['snake'],
    },
};
```


This rule can be configured to ignore specified property names.

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'object-prop-casing': [
            'camel',
            {
                ignore: ['ODD', 'cAsinG'], // parameter names to ignore
            },
        ],
    },
};
```
