import {OpenAPI, OpenAPIVisitorName} from '../types';
import {isObject, hasKey} from '.';

export function isRef(
    arg: Record<string, unknown>,
): arg is OpenAPI.ReferenceObject {
    return typeof arg.$ref === 'string';
}

const openapiVisitorSet = new Set([
    'DiscriminatorObject',
    'XMLObject',
    'SchemaObject',
    'SpecificationExtensions',
    'LicenseObject',
    'ContactObject',
    'InfoObject',
    'ServerVariableObject',
    'ServerObject',
    'ExternalDocumentationObject',
    'TagObject',
    'SecurityRequirementObject',
    'ReferenceObject',
    'CallbackObject',
    'RuntimeExpression',
    'LinkObject',
    'OAuthFlowObject',
    'OAuthFlowsObject',
    'SecuritySchemeObject',
    'ExampleObject',
    'EncodingObject',
    'MediaTypeObject',
    'RequestBodyObject',
    'ParameterObject',
    'HeaderObject',
    'ResponseObject',
    'ResponsesObject',
    'OperationObject',
    'PathItemObject',
    'PathsObject',
    'ComponentsObject',
    'OpenAPIObject',
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
