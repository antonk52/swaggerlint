/**
 * All types and their names should mimic the openapi spec (3.0.3).
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
 *
 * or
 *
 * https://swagger.io/specification/
 *
 */

/**
 * https://swagger.io/specification/#discriminatorObject
 */
export type DiscriminatorObject = {
    /**
     * The name of the property in the payload that will hold the discriminator value.
     */
    propertyName: string;
    /**
     * An object to hold mappings between payload values and schema names or references.
     */
    mapping?: Record<string, string>;
};

/**
 * https://swagger.io/specification/#xmlObject
 */
export type XMLObject = {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
};

type _CommonSchemaObjectFields = {
    /**
     * Default value is `false`.
     */
    nullable?: boolean;
    discriminator?: DiscriminatorObject;
    description?: string;
    /**
     * Default value is `false`.
     */
    readOnly?: boolean;
    /**
     * Default value is `false`.
     */
    writeOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: unknown;
    /**
     * Default value is `false`.
     */
    deprecated?: boolean;
    required?: boolean;
    default?: unknown;
};

type _MakeSchemaObject<O extends object> = O &
    _CommonSchemaObjectFields &
    SpecificationExtensions;

type _RefOr<O> = ReferenceObject | O;

type _SchemaStringObject = _MakeSchemaObject<{
    type: 'string';
    format?: 'byte' | 'binary' | 'date' | 'date-time' | 'password' | 'email';
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    enum?: string[];
    allOf?: _RefOr<_SchemaStringObject>[];
    oneOf?: _RefOr<_SchemaStringObject>[];
    anyOf?: _RefOr<_SchemaStringObject>[];
}>;

type _CommonNumericSchemObjectFields = {
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
};

type _SchemaIntegerObject = _MakeSchemaObject<
    {
        type: 'integer';
        format?: 'int32' | 'int64';
        allOf?: _RefOr<_SchemaIntegerObject>[];
        oneOf?: _RefOr<_SchemaIntegerObject>[];
        anyOf?: _RefOr<_SchemaIntegerObject>[];
    } & _CommonNumericSchemObjectFields
>;

type _SchemaNumberObject = _MakeSchemaObject<
    {
        type: 'number';
        format?: 'float' | 'double';
        allOf?: _RefOr<_SchemaNumberObject>[];
        oneOf?: _RefOr<_SchemaNumberObject>[];
        anyOf?: _RefOr<_SchemaNumberObject>[];
    } & _CommonNumericSchemObjectFields
>;

type _SchemaBooleanObject = _MakeSchemaObject<{
    type: 'boolean';
    allOf?: _RefOr<_SchemaBooleanObject>[];
    oneOf?: _RefOr<_SchemaBooleanObject>[];
    anyOf?: _RefOr<_SchemaBooleanObject>[];
}>;

type _SchemaArrayObject = _MakeSchemaObject<{
    type: 'array';
    maxItems?: number;
    minItems?: number;
    uniqueItems?: number;
    items: _RefOr<SchemaObject>;
    allOf?: _RefOr<_SchemaArrayObject>[];
    oneOf?: _RefOr<_SchemaArrayObject>[];
    anyOf?: _RefOr<_SchemaArrayObject>[];
}>;

type _SchemaObjectObject = _MakeSchemaObject<{
    type: 'object';
    properties: Record<string, _RefOr<SchemaObject>>;
    required?: string[];
    additionalProperties?: boolean | _RefOr<SchemaObject>;
    allOf?: _RefOr<_SchemaObjectObject>[];
    oneOf?: _RefOr<_SchemaObjectObject>[];
    anyOf?: _RefOr<_SchemaObjectObject>[];
}>;

/**
 * https://swagger.io/specification/#schemaObject
 */
export type SchemaObject =
    | _SchemaStringObject
    | _SchemaIntegerObject
    | _SchemaNumberObject
    | _SchemaBooleanObject
    | _SchemaObjectObject
    | _SchemaArrayObject;

/**
 * https://swagger.io/specification/#specificationExtensions
 *
 * The extensions properties are implemented as patterned fields that are always prefixed by `"x-"`.
 */
export type SpecificationExtensions = {
    /**
     * Allows extensions to the OpenAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be null, a primitive, an array or an object. Can have any valid JSON format value.
     */
    [key: string]: unknown;
};

/**
 * https://swagger.io/specification/#licenseObject
 */
export type LicenseObject = {
    name: string;
    url?: string;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#contactObject
 */
export type ContactObject = {
    name?: string;
    url?: string;
    email?: string;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#infoObject
 */
export type InfoObject = {
    title: string;
    /**
     * A short description of the API. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    termsOfService?: string;
    /**
     * The contact information for the exposed API.
     */
    contact?: ContactObject;
    license?: LicenseObject;
    /**
     * The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).
     */
    version: string;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#serverVariableObject
 */
export type ServerVariableObject = {
    enum?: string[];
    default: string;
    description?: string;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#serverObject
 */
export type ServerObject = {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariableObject>;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#externalDocumentationObject
 */
export type ExternalDocumentationObject = {
    description?: string;
    url: string;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#tagObject
 */
export type TagObject = {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#securityRequirementObject
 */
export type SecurityRequirementObject = Record<string, string[]>;

/**
 * https://swagger.io/specification/#referenceObject
 */
export type ReferenceObject = {
    $ref: string;
};

/**
 * https://swagger.io/specification/#callbackObject
 */
export type CallbackObject = Record<string, PathItemObject | ReferenceObject> &
    SpecificationExtensions;

/**
 * https://swagger.io/specification/#runtimeExpression
 */
export type RuntimeExpression = string;

/**
 * https://swagger.io/specification/#linkObject
 */
export type LinkObject = {
    operationRef?: string;
    operaionId?: string;
    parameters?: Record<string, unknown | RuntimeExpression>;
    requestBody?: unknown | RuntimeExpression;
    description?: string;
    server?: ServerObject;
} & SpecificationExtensions;

type _CommonOauthFlowObjectFields = {
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty.
     */
    scopes: Record<string, string>;
};
type _OAuthFlowObjectImplicit = {
    /**
     * The authorization URL to be used for this flow. This MUST be in the form of a URL.
     */
    authorizationUrl: string;
} & _CommonOauthFlowObjectFields;
type _OAuthFlowObjectAuthorizationCode = {
    /**
     * The authorization URL to be used for this flow. This MUST be in the form of a URL.
     */
    authorizationUrl: string;
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL.
     */
    tokenUrl: string;
} & _CommonOauthFlowObjectFields;
type _OAuthFlowObjectPasswordAndClientCredentials = {
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL.
     */
    tokenUrl: string;
} & _CommonOauthFlowObjectFields;

/**
 * https://swagger.io/specification/#oauthFlowObject
 */
export type OAuthFlowObject =
    | _OAuthFlowObjectImplicit
    | _OAuthFlowObjectAuthorizationCode
    | _OAuthFlowObjectPasswordAndClientCredentials;

/**
 * https://swagger.io/specification/#oauthFlowsObject
 */
export type OAuthFlowsObject = {
    /**
     * Configuration for the OAuth Implicit flow
     */
    implicit?: _OAuthFlowObjectImplicit;
    /**
     * Configuration for the OAuth Resource Owner Password flow
     */
    password?: _OAuthFlowObjectPasswordAndClientCredentials;
    /**
     * Configuration for the OAuth Client Credentials flow.
     */
    clientCredentials?: _OAuthFlowObjectPasswordAndClientCredentials;
    /**
     * Configuration for the OAuth Authorization Code flow.
     */
    authorizationCode?: _OAuthFlowObjectAuthorizationCode;
};

/**
 * https://swagger.io/specification/#securitySchemeObject
 */

type _SecuritySchemeObjectApiKey = {
    type: 'apiKey';
    description?: string;
    /**
     * The name of the header, query or cookie parameter to be used.
     */
    name: string;
    /**
     * The location of the API key.
     */
    in: 'query' | 'header' | 'cookie';
};
type _SecuritySchemeObjectHttp = {
    type: 'http';
    description?: string;
    /**
     * The name of the HTTP Authorization scheme to be used in the Authorization header as defined in RFC7235. The values used SHOULD be registered in the IANA Authentication Scheme registry.
     */
    scheme: string;
    /**
     * A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
     */
    bearerFormat?: string;
};
type _SecuritySchemeObjectOauth2 = {
    type: 'oauth2';
    description?: string;
    /**
     * An object containing configuration information for the flow types supported.
     */
    flows: OAuthFlowsObject;
};
type _SecuritySchemeObjectOpenIdConnectUrl = {
    type: 'openIdConnect';
    description?: string;
    /**
     * OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.
     */
    openIdConectUrl: string;
};
export type SecuritySchemeObject =
    | _SecuritySchemeObjectApiKey
    | _SecuritySchemeObjectHttp
    | _SecuritySchemeObjectOauth2
    | _SecuritySchemeObjectOpenIdConnectUrl;

/**
 * https://swagger.io/specification/#exampleObject
 */
export type ExampleObject = {
    summary?: string;
    description?: string;
    value?: unknown;
    externalValue?: string;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#encodingObject
 */
export type EncodingObject = {
    /**
     * The Content-Type for encoding a specific property. Default value depends on the property type: for `string` with `format` being `binary` – `application/octet-stream`; for other primitive types – `text/plain`; for object - `application/json`; for array – the default is defined based on the inner type. The value can be a specific media type (e.g. `application/json`), a wildcard media type (e.g. `image/*`), or a comma-separated list of the two types.
     */
    contentType?: string;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    /**
     * Describes how a specific property value will be serialized depending on its type. See `Parameter Object` for details on the `style` property. The behavior follows the same values as `query` parameters, including default values. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
     */
    style?: string;
    /**
     * When this is true, property values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When `style` is `form`, the default value is `true`. For all other styles, the default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
     */
    explode?: boolean;
    /**
     * Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. The default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
     */
    allowReserved?: boolean;
};

/**
 * https://swagger.io/specification/#mediaTypeObject
 */
export type MediaTypeObject = {
    schema?: SchemaObject | ReferenceObject;
    example?: unknown;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    /**
     * A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to `requestBody` objects when the media type is `multipart` or `application/x-www-form-urlencoded`.
     */
    encoding?: Record<string, EncodingObject>;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#requestBodyObject
 */
export type RequestBodyObject = {
    description?: string;
    /**
     * The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
     */
    content: Record<string, MediaTypeObject>;
    /**
     * Determines if the request body is required in the request. Defaults to `false`.
     */
    required?: boolean;
} & SpecificationExtensions;

type _SimpleParam = {
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema: SchemaObject | ReferenceObject;
    example?: unknown;
    examples?: Record<string, ExampleObject | ReferenceObject>;
};

type _ComplexParam = {
    /**
     * A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.
     */
    content: Record<string, MediaTypeObject>;
};

type _CommonParameterObjectFields = {
    description?: string;
    /**
     * Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is `false`.
     */
    deprecated?: boolean;
    /**
     * Default value is false.
     */
    required?: boolean;
};

type _PathParameterObject = {
    name: string;
    in: 'path';
    required: true;
};

type _QueryParameterObject = {
    name: string;
    in: 'query';
    /**
     * Sets the ability to pass empty-valued parameters. Allows sending a parameter with an empty value. Default value is `false`.
     */
    allowEmptyValue?: boolean;
};

type _HeaderParameterObject = {
    name: string;
    in: 'header';
};

type _CookieParameterObject = {
    name: string;
    in: 'cookie';
};

type _MakeParam<P> = P &
    _CommonParameterObjectFields &
    (_SimpleParam | _ComplexParam);

/**
 * https://swagger.io/specification/#parameterObject
 */
export type ParameterObject =
    | _MakeParam<_QueryParameterObject>
    | _MakeParam<_PathParameterObject>
    | _MakeParam<_HeaderParameterObject>
    | _MakeParam<_CookieParameterObject>;

/**
 * https://swagger.io/specification/#headerObject
 */
export type HeaderObject = _MakeParam<{}>;

/**
 * https://swagger.io/specification/#responseObject
 */
export type ResponseObject = {
    description?: string;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    content?: Record<string, MediaTypeObject>;
    links?: Record<string, LinkObject | ReferenceObject>;
};

/**
 * https://swagger.io/specification/#responsesObject
 */
export type ResponsesObject = {
    /**
     * The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. A `Reference Object` can link to a response that the `OpenAPI Object's components/responses` section defines.
     */
    default?: ResponseObject | ReferenceObject;
} & {
    /**
     * Any `HTTP status code` can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the `OpenAPI Object's components/responses` section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between `[200-299]`. Only the following range definitions are allowed: `1XX`, `2XX`, `3XX`, `4XX`, and `5XX`. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
     */
    [httpStatusCode: string]: ResponseObject | ReferenceObject;
};

/**
 * https://swagger.io/specification/#operationObject
 */
export type OperationObject = {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operaionId?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    /**
     * The list of possible responses as they are returned from executing this operation.
     */
    responses: ResponsesObject;
    callbacks?: Record<string, CallbackObject | ReferenceObject>;
    /**
     * Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is `false`.
     */
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
};

/**
 * https://swagger.io/specification/#pathItemObject
 */
export type PathItemObject = {
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: (ParameterObject | ReferenceObject)[];
};

/**
 * https://swagger.io/specification/#pathsObject
 */
export type PathsObject = Record<string, PathItemObject | ReferenceObject> &
    SpecificationExtensions;

/**
 * https://swagger.io/specification/#componentsObject
 */
export type ComponentsObject = {
    schemas?: Record<string, SchemaObject | ReferenceObject>;
    responses?: Record<string, ResponseObject | ReferenceObject>;
    parameters?: Record<string, ParameterObject | ReferenceObject>;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
    links?: Record<string, LinkObject | ReferenceObject>;
    callbacks?: Record<string, CallbackObject | ReferenceObject>;
} & SpecificationExtensions;

/**
 * https://swagger.io/specification/#oasObject
 */
export type OpenAPIObject = {
    openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3';
    info: InfoObject;
    servers?: ServerObject[];
    paths: PathsObject;
    components?: ComponentsObject;
    security?: SecurityRequirementObject[];
    tags?: TagObject[];
    externalDocs?: ExternalDocumentationObject;
} & SpecificationExtensions;
