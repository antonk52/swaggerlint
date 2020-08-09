# no-inline-enums

This rule validates that no `SchemaObject` with enum is located outside of `DefinitionsObject` for Swagger or `ComponentsObject` for OpenAPI.

## Examples of valid and invalid OpenAPI SchemaObjects

```yaml
paths:
    '/url':
        get:
            responses:
                '200':
                    content:
                        'application/json':
                            schema:
                                type: 'string' # <-- invalid
                                enum: ['foo', 'bar']
components:
    schemas:
        Example:
            type: 'string' # <-- valid
            enum: ['foo', 'bar']
```
## Examples of valid and invalid Swagger SchemaObjects

```yaml
paths:
    '/url':
        get:
            responses:
                default:
                    description: 'default response'
                    schema:
                        type: 'string' # <-- invalid
                        enum: ['foo', 'bar']
definitions:
    Example:
        type: 'string' # <-- valid
        enum: ['foo', 'bar']
```
