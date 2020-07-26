# no-empty-object-type

This rule validates that no `SchemaObject`s can be empty object types

## Examples of valid OpenAPI SchemaObject types

```yaml
components:
    schemas:
        SomeApiResponse:
            type: "object"
            properties: # <-- valid because properties are specified
                foo:
                    type: "string"
        SomeApiResponse:
            type: "object"
            allOf: # <-- valid because properties can be discovered via allOf
                - $ref: "#/components/schemas/Foo"
                - $ref: "#/components/schemas/Bar"
```

## Examples of invalid OpenAPI SchemaObject

```yaml
components:
    schemas:
        SomeApiResponse:
            type: "object" # <-- invalid because no properties are specified
```
