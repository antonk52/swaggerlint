import {SwaggerlintRule} from '../../types';

const name = 'no-empty-object-type';

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        SchemaObject: ({node, report}): void => {
            if (node.type !== 'object') return;

            const hasProperties = 'properties' in node && !!node.properties;
            const hasAllOf = 'allOf' in node && !!node.allOf;
            const hasAdditionalProperties =
                'additionalProperties' in node && !!node.additionalProperties;

            if (hasProperties || hasAllOf || hasAdditionalProperties) return;

            report(
                `has "object" type but is missing "properties" | "additionalProperties" | "allOf"`,
            );
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

            report(
                `has "object" type but is missing "properties" | "additionalProperties" | "allOf" | "anyOf" | "oneOf"`,
            );
        },
    },
};

export default rule;
