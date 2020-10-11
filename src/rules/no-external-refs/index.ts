import {createRule} from '../../utils';

const name = 'no-external-refs';

const rule = createRule({
    name,
    docs: {
        recommended: false,
        description: 'Forbids the usage of external ReferenceObjects',
    },
    meta: {
        messages: {
            msg: 'External references are banned.',
        },
    },
    openapiVisitor: {
        ReferenceObject: ({node, report}): void => {
            if (!node.$ref.startsWith('#')) {
                report({messageId: 'msg'});
            }
        },
    },
});

export default rule;
