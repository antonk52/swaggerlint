# required-operation-tags

This rule validates that all `OperationObject`s have at least one tag specified.

## Examples of valid OpenAPI ParameterObject

```yaml
paths:
    "/get/stocks":
        get:
            summary: "returns the amount of stocks"
            tags:
                - stocks # <-- valid
            responses:
                "200":
                    description: "successful operation"
                    content:
                        "application/json":
                            $ref: "#/definitions/StocksDTO"
```

## Examples of invalid OpenAPI OperationObject

```yaml
paths:
    "/get/stocks":
        get: # <-- invalid, no tags property
            summary: "returns the amount of stocks"
            responses:
                "200":
                    description: "successful operation"
                    content:
                        "application/json":
                            $ref: "#/definitions/StocksDTO"
        post:
            summary: "returns the amount of stocks"
            tags: [] # <-- invalid, no tags present
            parameters:
                - $ref: '#/components/parameters/StocksDTO'
            responses:
                "200":
                    description: "successful operation"
                    content:
                        "application/json":
                            $ref: "#/definitions/StocksDTO"
```
