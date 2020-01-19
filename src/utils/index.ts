import {
    ReferenceObject,
    SchemaObjectAllOfObject,
    VisitorName,
    SwaggerObject,
} from '../types';

const isDev = process.env.NODE_ENV === 'development';

export const log = isDev ? (x: string) => console.log(`--> ${x}`) : () => null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRef(arg: Record<string, any>): arg is ReferenceObject {
    return typeof arg.$ref === 'string';
}

export function isSchemaObjectAllOfObject(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arg: Record<string, any>,
): arg is SchemaObjectAllOfObject {
    return Array.isArray(arg.allOf);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(arg: any): arg is object {
    return typeof arg === 'object' && arg !== null && !Array.isArray(arg);
}

const visitorSet = new Set([
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
    'ResponseObject',
    'SchemaObject',
    'XMLObject',
    'HeadersObject',
    'HeaderObject',
    'ItemsObject',
    'ExampleObject',
]);
export function isValidVisitorName(name: string): name is VisitorName {
    return visitorSet.has(name);
}

export const validCases = {
    camel: new Set(['camel', 'lower']), // someName
    constant: new Set(['constant']), // SOME_NAME
    kebab: new Set(['kebab', 'lower']), // some-name
    pascal: new Set(['pascal']), // SomeName
    snake: new Set(['snake', 'lower']), // some_name
};

export function isValidCaseName(
    name: string | void,
): name is keyof typeof validCases {
    return name in validCases;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isSwaggerObject(arg: any): arg is SwaggerObject {
    return (
        typeof arg === 'object' &&
        !Array.isArray(arg) &&
        arg !== null &&
        arg.swagger === '2.0'
    );
}
