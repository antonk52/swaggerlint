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

You can lint your swagger scheme by path
```sh
swaggerlint /path/to/swagger.json
```

Or by providing a URL

```sh
swaggerlint https://...
```

#### Config flag

`swaggerlint` will automatically search up the directory tree for a `swaggerlint.config.js` file. Or you can specify it explicitly

```sh
swaggerlint --config /path/to/swaggerlint.config.js
```

### Nodejs

```js
const {swaggerlint} = require('swaggerlint')
const config = require('./configs/swaggerlint.config.js')
const swaggerScheme = require('./swagger.json')


const result = swaggerlint(swaggerScheme, config)

console.log(result) // an array or errors

/**
 * [{
 *   name: 'string', // rule name
 *   msg: 'string', // message from the rule checker
 *   location: ['path', 'to', 'error'] // what caused an error
 * }]
 */

```

## Config

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'object-prop-casing': ['camel'],
        'properties-for-object-type': true,
        'latin-definitions-only': true,
    },
}
```

## Rules

You can set any rule value to `false` to disable it or to `true` to enable and set its setting to default value.

| rule name | value | description |
|------------------------|------------------|------------------|
| `object-prop-casing`   | `'camel'` \| `'snake'` \| `'pascal'` \| `'constant'` | Casing for your object property names. |
| `no-empty-object-type` | `true` \| `false` | Object types have to have their properties specified. |
| `no-single-allof` | `true` \| `false` | Object types should not have a redundant single `allOf` property. |
| `latin-definitions-only` | `true` \| `false` | Error when non Latin characters used in definition names. |
| `path-param-required-field` | `true` \| `false` | Helps to keep consistently set optional `required` property in path parameters. |
| `expressive-path-summary` | `true` \| `false` | Helps to have an intentional summary. |
| `only-valid-mime-types` | `true` \| `false` | Checks mime types against known from [`mime-db`](https://npm.im/mime-db). |
| `parameter-casing` | `'camel'` \| `'snake'` \| `'pascal'` \| `'constant'` | Casing for your parameters. |
| `required-operation-tags` | `true` \| `false` | All operations must have tags. |
| `required-tag-description` | `true` \| `false` | All tags must have description. |
| `required-parameter-description` | `true` \| `false` | All parameters must have description. |
| `no-trailing-slash` | `true` \| `false` | All URLs must NOT end with a slash. |

### Acknowledgments

This tool has been inspired by already existing swagger validation checkers:

- [api lint](https://github.com/danielgtaylor/apilint)
- [speccy](https://github.com/wework/speccy)
- [zally](https://github.com/zalando/zally)
- [openapi-validator](https://github.com/IBM/openapi-validator)
