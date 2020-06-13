# only-valid-mime-types

By default this rule is checking the mime types specified in `consumes` and `produces` properties in `SwaggerObject` and `OperationObject`.

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'only-valid-mime-types': true,
    },
};
```
