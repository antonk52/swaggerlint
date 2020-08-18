# How to test a rule

To test a rule you should utilize a built-in utility called `RuleTester`. Make sure to run it inside your test files.

```js
// nodejs
const {RuleTester} = require('swaggerlint');
const rule = require('../my-custom-rule');

// es modules / typescript
import {RuleTester} from 'swaggerlint';
import rule from '../my-custom-rule';

const ruleTester = new RuleTester(rule);

ruleTester.run({
    swagger: {
        valid: [
            {
                it: 'test name', // will be displayed in the test report
                schema: {}, // part of the swagger schema to be tested
            },
            // other test cases
        ],
        invalid: [
            {
                it: 'test name',
                schema: {
                    path: {/* ... */}
                },
                errors: [/* ... */], // list of expected errors
            },
            // other test cases
        ]
    }
})
```
