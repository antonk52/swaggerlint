import {createRule} from '../../utils';

const name = 'no-external-refs';

const rule = createRule({
    name,
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
