# Swaggerlint

`Swaggerlint` helps you to have a consistent API style by linting your swagger / OpenAPI Scheme.

<p align="center"><img src="https://user-images.githubusercontent.com/5817809/72013495-0b443700-326f-11ea-9549-84dce1ec861e.png" width="600" alt="npm command"></p>

## Installation

Install it in your project

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

| rule name | value | setting | default |
|------------------------|------------------|------------------|------------------|
| `object-prop-casing`   | Casing for your object property names. | `'camel'` \| `'snake'` \| `'pascal'` \| `'constant'` | `camel` |
| `no-empty-object-type` | Object types have to have their properties specified. |
| `no-single-allof` | Object types should not have a redundant single `allOf` property. |
| `latin-definitions-only` | Error when non Latin characters used in definition names. |
| `path-param-required-field` | Helps to keep consistently set optional `required` property in path parameters. |
| `expressive-path-summary` | Helps to have an intentional summary. |
| `only-valid-mime-types` | Checks mime types against known from [`mime-db`](https://npm.im/mime-db). |
| `parameter-casing` | Casing for your parameters. | `'camel'` \| `'snake'` \| `'pascal'` \| `'constant'` | `camel` |
| `required-operation-tags` | All operations must have tags. |
| `required-tag-description` | All tags must have description. |
| `required-parameter-description` | All parameters must have description. |
| `no-trailing-slash` | All URLs must NOT end with a slash. |

### Acknowledgments

This tool has been inspired by already existing swagger validation checkers:

- [api lint](https://github.com/danielgtaylor/apilint)
- [speccy](https://github.com/wework/speccy)
- [zally](https://github.com/zalando/zally)
- [openapi-validator](https://github.com/IBM/openapi-validator)
