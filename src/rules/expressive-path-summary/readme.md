# expressive-path-summary

This rule validates that all `OperationObject`s have a non-empty `summary` property with at least 2 words in it. Due to some swagger/openapi generation tools auto filling this property with controller names or other generated content.

## Examples of valid parameters in OperationObject

```yaml
# OpenAPI example
paths:
    "/get/stocks":
        get:
            summary: "returns the amount of stocks" # <-- valid
            responses:
                "200":
                    description: "successful operation"
                    content:
                        "application/json":
                            $ref: "#/definitions/StocksDTO"
```

## Examples of invalid summary in OperationObject

```yaml
# OpenAPI example
paths:
    "/get/stocks":
        get:
            summary: "GetStocksController" # <-- invalid
            responses:
                "200":
                    description: "successful operation"
                    content:
                        "application/json":
                            $ref: "#/definitions/StocksDTO"
```
