# no-single-allof

This rule validates that no SchemaObject with allOf property contains a single SchemaObject.

## Examples of valid OpenAPI SchemaObject types

```yaml
components:
    schemas:
        SomeApiResponse:
            type: "object"
            allOf: # <-- valid
                - $ref: "#/components/schemas/Foo"
                - $ref: "#/components/schemas/Bar"
```

## Examples of invalid OpenAPI SchemaObject

`SomeApiResponse` object can be avoided by referring to Foo instead

```yaml
components:
    schemas:
        SomeApiResponse:
            type: "object"
            allOf: # <-- invalid
                - $ref: "#/components/schemas/Foo"
```
