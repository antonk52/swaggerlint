# no-external-refs

This rule bans the use of `ReferenceObjects` referring to external files.

This rule only applies to OpenAPI.

## Examples of valid and invalid OpenAPI ReferenceObjects

```yaml
components:
    schemas:
        Example:
            type: 'object'
            properties:
                foo:
                    $ref: '#/components/schemas/Foo' # <-- valid
                bar:
                    $ref: 'schemas.yaml#/Bar' # <-- invalid
```
