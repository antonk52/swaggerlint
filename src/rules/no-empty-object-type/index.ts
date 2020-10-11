import {createRule} from '../../utils';

const name = 'no-empty-object-type';

const rule = createRule({
    name,
    docs: {
        recommended: true,
        description:
            'Object types have to have their properties specified explicitly',
    },
    meta: {
        messages: {
            swagger: `has "object" type but is missing "properties" | "additionalProperties" | "allOf"`,
            openapi: `has "object" type but is missing "properties" | "additionalProperties" | "allOf" | "anyOf" | "oneOf"`,
        },
    },
    swaggerVisitor: {
        SchemaObject: ({node, report}): void => {
            if (node.type !== 'object') return;

            const hasProperties = 'properties' in node && !!node.properties;
            const hasAllOf = 'allOf' in node && !!node.allOf;
            const hasAdditionalProperties =
                'additionalProperties' in node && !!node.additionalProperties;

            if (hasProperties || hasAllOf || hasAdditionalProperties) return;

            report({
                messageId: 'swagger',
            });
        },
    },
    openapiVisitor: {
        SchemaObject: ({node, report}): void => {
            if (node.type !== 'object') return;

            const hasProperties = 'properties' in node && !!node.properties;
            const hasAllOf = 'allOf' in node && !!node.allOf;
            const hasAnyOf = 'anyOf' in node && !!node.anyOf;
            const hasOneOf = 'oneOf' in node && !!node.oneOf;
            const hasAdditionalProperties =
                'additionalProperties' in node && !!node.additionalProperties;

            if (
                hasProperties ||
                hasAllOf ||
                hasAnyOf ||
                hasOneOf ||
                hasAdditionalProperties
            )
                return;

            report({
                messageId: 'openapi',
            });
        },
    },
});

export default rule;
