# Swaggerlint

`Swaggerlint` helps you to have a consistent API style by linting your swagger / OpenAPI Scheme.

<p align="center"><img src="https://user-images.githubusercontent.com/5817809/72013495-0b443700-326f-11ea-9549-84dce1ec861e.png" width="750" alt="npm command"></p>

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
const {swaggerlint} = require('swaggerlint');
const config = require('./configs/swaggerlint.config.js');
const swaggerScheme = require('./swagger.json');

const result = swaggerlint(swaggerScheme, config);

console.log(result); // an array or errors

/**
 * [{
 *   name: 'string', // rule name
 *   msg: 'string', // message from the rule checker
 *   location: ['path', 'to', 'error'] // what caused an error
 * }]
 */
```

### Docker image

If you do not have nodejs installed you can use the [swaggerlint docker image](https://hub.docker.com/r/antonk52/alpine-swaggerlint).

## Config

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'object-prop-casing': ['camel'],
        'properties-for-object-type': true,
        'latin-definitions-only': true,
    },
};
```

## Rules

You can set any rule value to `false` to disable it or to `true` to enable and set its setting to default value.

| rule name                                                                                | description                                                                     | default |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------- |
| [`expressive-path-summary`](./src/rules/expressive-path-summary/readme.md)               | Helps to have an intentional summary.                                           |
| [`latin-definitions-only`](./src/rules/latin-definitions-only/readme.md)                 | Error when non Latin characters used in definition names.                       |
| [`no-empty-object-type`](./src/rules/no-empty-object-type/readme.md)                     | Object types have to have their properties specified.                           |
| [`no-external-refs`](./src/rules/no-external-refs/readme.md)                             | Bans ReferenceObjects with external refferences.                                |
| [`no-inline-enums`](./src/rules/no-inline-enums/readme.md)                               | Enums must be in DefinitionsObject or ComponentsObject.                         |
| [`no-single-allof`](./src/rules/no-single-allof/readme.md)                               | Object types should not have a redundant single `allOf` property.               |
| [`no-trailing-slash`](./src/rules/no-trailing-slash/readme.md)                           | All URLs must NOT end with a slash.                                             |
| [`object-prop-casing`](./src/rules/object-prop-casing/readme.md)                         | Casing for your object property names.                                          | `camel` |
| [`only-valid-mime-types`](./src/rules/only-valid-mime-types/readme.md)                   | Checks mime types against known from [`mime-db`](https://npm.im/mime-db).       |
| [`parameter-casing`](./src/rules/parameter-casing/readme.md)                             | Casing for your parameters.                                                     | `camel` |
| [`path-param-required-field`](./src/rules/path-param-required-field/readme.md)           | Helps to keep consistently set optional `required` property in path parameters. |
| [`required-operation-tags`](./src/rules/required-operation-tags/readme.md)               | All operations must have tags.                                                  |
| [`required-parameter-description`](./src/rules/required-parameter-description/readme.md) | All parameters must have description.                                           |
| [`required-tag-description`](./src/rules/required-tag-description/readme.md)             | All tags must have description.                                                 |

Additionally see the docs for additional settings for [`obj-prop-casing`](./src/rules/object-prop-casing/readme.md) and [`parameter-casing`](./src/rules/parameter-casing/readme.md).

## Documentation

-   [How to write a rule](./docs/how-to-write-a-rule.md)

### Acknowledgments

This tool has been inspired by already existing swagger validation checkers:

-   [api lint](https://github.com/danielgtaylor/apilint)
-   [speccy](https://github.com/wework/speccy)
-   [zally](https://github.com/zalando/zally)
-   [openapi-validator](https://github.com/IBM/openapi-validator)
