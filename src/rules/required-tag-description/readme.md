# required-tag-description

This rule validates that all `TagObject`s have description.

## Examples of valid OpenAPI TagObject

```yaml
tags:
    - name: stocks
      description: "all operations associated in working with stocks" # <-- valid
```

## Examples of invalid OpenAPI TagObject

```yaml
tags:
    - name: stocks # <-- invalid, no description specified
    - name: billing
      description: "" # <-- invalid, cannot be empty
```
