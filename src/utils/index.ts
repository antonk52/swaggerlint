import {
    ReferenceObject,
    SchemaObjectAllOfObject,
    VisitorName,
    SwaggerObject,
} from '../types';

const isDev = process.env.NODE_ENV === 'development';

export const log = isDev
    ? (x: string): void => console.log(`--> ${x}`)
    : (): null => null;

export function isRef(arg: Record<string, unknown>): arg is ReferenceObject {
    return typeof arg.$ref === 'string';
}

export function isSchemaObjectAllOfObject(
    arg: Record<string, unknown>,
): arg is SchemaObjectAllOfObject {
    return Array.isArray(arg.allOf);
}

export function isObject(arg: unknown): arg is object {
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
    return name in validCases;
}

export function hasKey<K extends string>(
    key: K,
    obj: object,
): obj is {[key in K]: unknown} {
    return key in obj;
}

export function isSwaggerObject(arg: unknown): arg is SwaggerObject {
    return isObject(arg) && hasKey('swagger', arg) && arg.swagger === '2.0';
}
