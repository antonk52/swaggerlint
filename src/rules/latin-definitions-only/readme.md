# latin-definitions-only

This rule validates that all names in `DefinitionsObject` for Swagger and in `ComponentsObject` for OpenAPI have no non-latin characters. This rule is specially useful when swagger/openapi is being generated from code annotations.

## Examples of valid OpenAPI ComponentsObject

```yaml
components:
    schemas:
        SomeApiResponse: # <-- valid
            type: "string"
```

## Examples of invalid OpenAPI ComponentsObject

```yaml
components:
    schemas:
        "Some api reponse": # <-- invalid
            type: "string"
        "another, thing ! here {}": # <-- invalid
            type: "number"
        "тоже невалидное название": # <-- invalid
            type: "number"
```

## Configuration

This rule can be configured to ignore specified characters.

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'latin-definitions-only': [
            '',
            {
                ignore: ['$', '#'], // characters to ignore
            },
        ],
    },
};
```
