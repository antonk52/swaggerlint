# Swagger linter

`Swagger-linter` helps you to have a consistent API style by linting your swagger / OpenAPI Scheme.

## Instalation

TODO

## Usage

### Url flag

```sh
swagger-stylelint --url https://...
```

### Path flag

```sh
swagger-stylelint --path /path/to/swagger.json
```

## Config

TODO

## Rules

| rule name | value | description |
|------------------------|------------------|------------------|
| `object-prop-casing`   | `'camel' | 'lower' | 'snake' | 'pascal' | 'constant'` | Select one or more casing for your object property names. |
| `properties-for-object-type` | `[]` | Object types have to have their properties specified. |

