import type {JSONSchema7} from 'json-schema';
import {SwaggerVisitorName, SwaggerlintRule} from '../types';
export * from './common';
import {validate} from './validate-json';

const isDev = process.env.NODE_ENV === 'development';

export const log = isDev
    ? (x: string): void => console.log(`--> ${x}`)
    : (): null => null;

/**
 * TODO: extract swagger v2 specific utils into separate file
 */

const swaggerVisitorSet = new Set([
    'SwaggerObject',
    'InfoObject',
    'PathsObject',
    'DefinitionsObject',
    'ParametersDefinitionsObject',
    'ResponsesDefinitionsObject',
    'SecurityDefinitionsObject',
    'SecuritySchemeObject',
    'ScopesObject',
    'SecurityRequirementObject',
    'TagObject',
    'ExternalDocumentationObject',
    'ContactObject',
    'LicenseObject',
    'PathItemObject',
    'OperationObject',
    'ParameterObject',
    'ResponsesObject',
    'ReferenceObject',
    'ResponseObject',
    'SchemaObject',
    'XMLObject',
    'HeadersObject',
    'HeaderObject',
    'ItemsObject',
    'ExampleObject',
]);
export function isValidSwaggerVisitorName(
    name: string,
): name is SwaggerVisitorName {
    return swaggerVisitorSet.has(name);
}

type ValidCasesObj = {
    camel: Set<'camel' | 'lower'>;
    constant: Set<'constant'>;
    kebab: Set<'kebab' | 'lower'>;
    pascal: Set<'pascal'>;
    snake: Set<'snake' | 'lower'>;
};
export const validCases: ValidCasesObj = {
    camel: new Set(['camel', 'lower']), // someName
    constant: new Set(['constant']), // SOME_NAME
    kebab: new Set(['kebab', 'lower']), // some-name
    pascal: new Set(['pascal']), // SomeName
    snake: new Set(['snake', 'lower']), // some_name
};

export function isValidCaseName(
    name: string | void,
): name is keyof typeof validCases {
    return typeof name === 'string' && name in validCases;
}

const ruleJsonSchema: JSONSchema7 = {
    type: 'object',
    required: ['name'],
    properties: {
        name: {
            type: 'string',
        },
        meta: {
            type: 'object',
            properties: {
                messages: {
                    type: 'object',
                },
                schema: {
                    type: 'object',
                },
            },
        },
        openapiVisitor: {
            type: 'object',
        },
        swaggerVisitor: {
            type: 'object',
        },
    },
    additionalProperties: true,
};

export function createRule<T extends string>(
    rule: SwaggerlintRule<T>,
): typeof rule {
    const errors = validate(ruleJsonSchema, rule);

    if (errors[0]) throw errors[0];

    return rule;
}
