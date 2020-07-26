# path-param-required-field

This rule validates that all `ParameterObject`s specify optional parameter field explicitly.

## Examples of valid OpenAPI ParameterObject

```yaml
components:
    parameters:
        petId:
            name: petId
            in: path
            description: ID of pet that needs to be updated
            required: true # <-- valid
            schema:
                type: string
        petBreed:
            name: petBreed
            in: query
            description: Breed of pet that needs to be updated
            required: false # <-- valid
            schema:
                type: string
```

## Examples of invalid OpenAPI SchemaObject

```yaml
components:
    parameters:
        petId: # <-- invalid
            name: petId
            in: path
            description: ID of pet that needs to be updated
            schema:
                type: string
```
