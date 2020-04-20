import {OpenAPI, OpenAPIVisitorName} from '../types';

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
