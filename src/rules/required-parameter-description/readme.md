# required-parameter-description rule

This rule checks for all parameters in `ParameterObject` to have `description`.

```js
// swaggerlint.config.js
module.exports = {
    rules: {
        'required-parameter-description': true,
    },
};
```

Examples of valid parameters in OperationObject

```yaml
parameters:
- name: "id"
  in: "query"
  description: "unique identifier"
  required: true
  type: "string"
```

Examples of **invalid** parameters in OperationObject

```yaml
parameters:
- name: "id"
  in: "query"
  required: true
  type: "string"
- name: "type"
  in: "query"
  description: ""
  required: true
  type: "string"
```
