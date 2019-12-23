# Swaggerlint

`Swaggerlint` helps you to have a consistent API style by linting your swagger / OpenAPI Scheme.

## Instalation

Install in your project

```sh
npm install swaggerlint
```

Install it globally
```sh
npm install --global swaggerlint
```

## Usage

### CLI

#### Url flag

```sh
swaggerlint --url https://...
```

#### Path flag

```sh
swaggerlint --path /path/to/swagger.json
```

#### Config flag

```sh
swaggerlint --config /path/to/swaggerlint.config.js
```

### Nodejs

```js
const {swaggerlint} = require('swaggerlint')
const config = require('./my-company-config.js')
const swaggerScheme = require('./generated-swagger-scheme')


const result = swaggerlint(swaggerScheme, config)

console.log(result) // an array or errors

/**
 * [{
 *   name: 'string', // rule name
 *   msg: 'string' // message from the rule checker
 * }]
 */

```

## Config

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'object-prop-casing': ['camel', 'lower'],
        'properties-for-object-type': [],
        'latin-definitions-only': [],
    },
}
```

## Rules

| rule name | value | description |
|------------------------|------------------|------------------|
| `object-prop-casing`   | `'camel'` \| `'snake'` \| `'pascal'` \| `'constant'` | Casing for your object property names. |
| `properties-for-object-type` | `[]` | Object types have to have their properties specified. |
| `latin-definitions-only` | `[]` | Error when non Latin characters used in definition names. |
| `path-param-required-field` | `[]` | Helps to keep consistently set optional `required` property in path parameters. |
