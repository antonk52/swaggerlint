import {OpenAPI, OpenAPIVisitorName} from '../types';
import {isObject, hasKey, newerHttpMethods} from './common';

export const httpMethods = newerHttpMethods;

export function isRef(
    arg: Record<string, unknown>,
): arg is OpenAPI.ReferenceObject {
    return typeof arg.$ref === 'string';
}

const openapiVisitorSet = new Set([
    'CallbackObject',
    'ComponentsObject',
    'ContactObject',
    'DiscriminatorObject',
    'EncodingObject',
    'ExampleObject',
    'ExternalDocumentationObject',
    'HeaderObject',
    'InfoObject',
    'LicenseObject',
    'LinkObject',
    'MediaTypeObject',
    'OAuthFlowObject',
    'OAuthFlowsObject',
    'OpenAPIObject',
    'OperationObject',
    'ParameterObject',
    'PathItemObject',
    'PathsObject',
    'ReferenceObject',
    'RequestBodyObject',
    'ResponseObject',
    'ResponsesObject',
    'SchemaObject',
    'SecurityRequirementObject',
    'SecuritySchemeObject',
    'ServerObject',
    'ServerVariableObject',
    'SpecificationExtensions',
    'TagObject',
    'XMLObject',
]);
export function isValidVisitorName(name: string): name is OpenAPIVisitorName {
    return openapiVisitorSet.has(name);
}

export function isValidOpenAPIObject(
    arg: unknown,
): arg is OpenAPI.OpenAPIObject {
    return (
        isObject(arg) &&
        hasKey('openapi', arg) &&
        typeof arg.openapi === 'string' &&
        ['3.0.0', '3.0.1', '3.0.2', '3.0.3'].includes(arg.openapi)
    );
}
