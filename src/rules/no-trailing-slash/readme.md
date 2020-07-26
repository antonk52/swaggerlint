# no-trailing-slash

This rule validates that all urls do not end with a slash.

## Examples of valid urls

```yaml
paths:
    "/get/stocks": # <-- valid
        get:
            description: get available stocks
            responses:
                $ref: #/components/responses/Stocks
servers:
    - description: development server
      url: http://dev.server.net/v1 # <-- valid
```

## Examples of invalid urls

```yaml
paths:
    "/get/stocks/": # <-- invalid
        get:
            description: get available stocks
            responses:
                $ref: #/components/responses/Stocks
servers:
    - description: development server
      url: http://dev.server.net/v1/ # <-- invalid
```
