# How to write a swaggerlint rule

Contents:
- [Rule base](#rule-base)
- [Visitor](#visitor)
- [Configurable rules](#configurable-rules)
    - [Default setting](#default-setting)
    - [Validate setting](#validate-setting)
- [Typescript](#typescript)
- [How to add a rule to core `swaggerlint` rules](#how-to-add-a-rule-to-core-swaggerlint-rules)

## Rule base

Any `swaggerlint` rule is an object and it has to have 2 required properties:
- your rule's `name`
- the `visitor`.

To create a rule you have to run it through `createRule` function which can verify the rule and improve the DX for typescript and VS-Code users.

```js
const {createRule} = require('swaggerlint')
module.exports = createRule({
    name: 'my-custom-rule',
    visitor: { /* visitors */}
})
```

## Visitor
Visitor pattern allows us to match on some part of the swagger scheme. This makes it easy to write rules that target different portions of the swagger scheme, ie you do not need to traverse the scheme to get all the objects to run your rule against. In the example below we match on [`ResponseObject`](https://swagger.io/specification/v2/#responseObject).

```js
const {createRule} = require('swaggerlint')
module.exports = createRule({
    name: 'my-custom-rule',
    // optional
    meta: {
        messages: {
            plainMessage: 'text to be displayed as an error message',
            templatedMessage: 'error message for {{name}}',
        }
    },
    visitor: {
        ResponseObject(param) {
            const {
                node, // ResponseObject itself
                location, // node location string[]
                report, // function to report an error
                setting // plugin setting
            } = param

            if (/* check for error */) {
                // to report an error call `report` function, ie
                report({message: 'message from your rule'})

                // alternatively you can specify a more precise location
                report({
                    message: 'message',
                    location: [...location, 'path', 'error', 'cause']
                })

                // you can also provide a messageId
                report({
                    messageId: 'plainMessage',
                })

                // if messageId has placeholders you can provide the data as an object
                report({
                    messageId: 'templatedMessage',
                    data: {
                        name: 'someString'
                    }
                })
            }
        }
    }
})
```

Swaggerlint allows you to match on any of the following objects:

* [SwaggerObject](https://swagger.io/specification/v2/#swagger-object)
* [ContactObject](https://swagger.io/specification/v2/#contactObject)
* [LicenseObject](https://swagger.io/specification/v2/#licenseObject)
* [InfoObject](https://swagger.io/specification/v2/#infoObject)
* [XmlObject](https://swagger.io/specification/v2/#xmlObject)
* [ExternalDocumentationObject](https://swagger.io/specification/v2/#externalDocumentationObject)
* [ItemsObject](https://swagger.io/specification/v2/#itemsObject)
* [ParameterObject](https://swagger.io/specification/v2/#parameterObject)
* [ReferenceObject](https://swagger.io/specification/v2/#referenceObject)
* [SecurityRequirementObject](https://swagger.io/specification/v2/#security-requirement-object)
* [ResponsesObject](https://swagger.io/specification/v2/#responsesObject)
* [OperationObject](https://swagger.io/specification/v2/#operationObject)
* [PathItemObject](https://swagger.io/specification/v2/#pathItemObject)
* [PathsObject](https://swagger.io/specification/v2/#pathsObject)
* [SchemaObject](https://swagger.io/specification/v2/#schemaObject)
* [HeadersObject](https://swagger.io/specification/v2/#headers-object)
* [ResponseObject](https://swagger.io/specification/v2/#responseObject)
* [ExampleObject](https://swagger.io/specification/v2/#example-object)
* [HeaderObject](https://swagger.io/specification/v2/#headerObject)
* [SecuritySchemeObject](https://swagger.io/specification/v2/#security-scheme-object)
* [ScopesObject](https://swagger.io/specification/v2/#scopes-object)
* [TagObject](https://swagger.io/specification/v2/#tagObject)
* [ParametersDefinitionsObject](https://swagger.io/specification/v2/#parametersDefinitionsObject)
* [ResponsesDefinitionsObject](https://swagger.io/specification/v2/#responses-definitions-object)
* [SecurityDefinitionsObject](https://swagger.io/specification/v2/#securityDefinitionsObject)
* [DefinitionsObject](https://swagger.io/specification/v2/#definitionsObject)

[Full swagger (v2.0) specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)

## Configurable rules

If your rule can be configured it has to contain **both** `defaultSetting` and `meta.schema` properties.

### Default setting

This will be used when the rule's value in swaggerlint config is set to `true`. Example:

```js
const {createRule} = require('swaggerlint')
module.exports = createRule({
    name: 'my-custom-rule',
    meta: {/* ... */},
    visitor: {/* ... */},
    defaultSetting: ['sensible-default']
})
```
### Setting schema

If a user has your rule set to anything other than `true` or `false` in `swaggerlint.config.js` we need to validate that your rule can be run with the supplied setting. `meta.schema` is a [JSON schema](http://json-schema.org/), it describes all possible values that the setting for your rule can be set to. If the setting validation fails, the rule won't run and the output will contain an error about invalid rule setting.

```js
const {createRule} = require('swaggerlint')
module.exports = createRule({
    name: 'my-custom-rule',
    meta: {
        schema: {
            type: 'array',
                items: {
                    type: 'string',
                },
            },
        },
    },
    visitor: {/* ... */},
    defaultSetting: [/* sensible default */]
})
```

## Typescript

If you use `typescript` you can leverage the types.

```ts
import {createRule} from 'swaggerlint'

const myCustomRule = createRule({
    name: 'my-custom-rule',
    meta: {
        messages: {
            foo: 'some string',
        }
    },
    visitor: {
        /**
         * param already has correct types about `node`, `report`, `location` and `setting`
         */
        ResponseObject(param) {
            /* your rule logic */

            report({
                messageId: 'foo'
                //         ^ correct type
            })
        }
    }
})

export default myCustomRule
```

## How to add a rule to core `swaggerlint` rules

After you wrote your rule you can propose to add it to default `swaggerlint` rules. To do so you need to add it to [`rules` directory](../src/rules/) and [`src/rules/index.ts` file](../src/rules/index.ts). After this you can create a PR, it is a good idea to explain on why you think adding this rule is a good idea.

Do not forget to add your rule to the project README to make it discoverable.
