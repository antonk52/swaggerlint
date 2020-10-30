import {createRule} from '../../utils';

const name = 'no-ref-properties';

const rule = createRule({
    name,
    docs: {
        recommended: true,
        description:
            'Disallows to have additional properties in Reference objects',
    },
    meta: {
        messages: {
            noRefProps:
                'To add properties to Reference Object, wrap it in `allOf` and add the properties to the added sibling SchemaObject',
        },
    },
    swaggerVisitor: {
        ReferenceObject: ({node, report}) => {
            const addonProps = Object.keys(node).filter(x => x !== '$ref');

            if (addonProps.length) {
                report({messageId: 'noRefProps'});
            }
        },
    },
    openapiVisitor: {
        ReferenceObject: ({node, report}) => {
            const addonProps = Object.keys(node).filter(x => x !== '$ref');

            if (addonProps.length) {
                report({messageId: 'noRefProps'});
            }
        },
    },
});

export default rule;
