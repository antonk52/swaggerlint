# no-ref-properties

This rule disallows to have additional properties in Reference objects.

## Examples of valid OpenAPI SchemaObject types

```yaml
components:
    schemas:
        SomeApiResponse:
            type: "object"
            properties:
                allOf: # <-- valid
                - $ref: "#/components/schemas/Foo"
                - description: "Info about foo"
```

## Examples of invalid OpenAPI SchemaObject

Reference Objects cannot contain properties besides `$ref`

```yaml
components:
    schemas:
        SomeApiResponse:
            type: "object"
            properties:
                $ref: "#/components/schemas/Foo"
                description: "Info about foo" # <-- invalid
```
