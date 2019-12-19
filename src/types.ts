/*
 * All types and their names should mimic the swagger spec.
 *
 * https://swagger.io/specification
 *
 * TODO
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
 */
export type Config = {
    rules: {
        [ruleName: string]: string[];
    };
    ignore?: {
        definitions?: string[];
    };
};

/**
 * https://swagger.io/specification/#contactObject
 */
export type ContactObject = {
    name?: string;
    url?: string;
    email?: string;
};

/**
 * https://swagger.io/specification/#licenseObject
 */
export type LicenceObject = {
    name: string;
    url?: string;
};

/**
 * https://swagger.io/specification/#infoObject
 */
export type InfoObject = {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    licence?: string;
    version: string;
};
export type XMLObject = {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjStub = Record<string, any>;
export type PropBase<A = ObjStub> = {
    title?: string;
    description?: string;
} & A;

type StrFormat = 'byte' | 'binary' | 'date' | 'date-time' | 'password';
export type PropString = PropBase<{
    type: 'string';
    format?: StrFormat;
    default?: string;
    enum?: string[];
}>;

type IntFormat = 'int32' | 'int64';
export type PropInteger = PropBase<{
    type: 'integer';
    format?: IntFormat;
    description?: string;
    default?: number;
    minimum?: number;
    maximum?: number;
}>;

type NumberFormat = 'float' | 'double';
export type PropNumber = PropBase<{
    type: 'number';
    format?: NumberFormat;
    default?: number;
    minimum?: number;
    maximum?: number;
}>;
export type PropBoolean = PropBase<{
    type: 'boolean';
    default?: boolean;
}>;
export type PropObject = PropBase<{
    type: 'object';
    properties: {
        [k: string]:
            | PropObject
            | PropString
            | PropInteger
            | PropNumber
            | PropBoolean;
    };
    required: string[];
}>;
export type PlainType =
    | 'object'
    | 'boolean'
    | 'string'
    | 'number'
    | 'integer'
    | 'array';
export type PropArray = PropBase<{
    type: 'array';
    items:
        | {
              $ref: string;
          }
        | {type: PlainType};
}>;
export type Property =
    | PropObject
    | PropString
    | PropInteger
    | PropNumber
    | PropBoolean
    | PropArray;

export type DefinitionObject = {
    title: string;
    description?: string;
    type: PlainType;
    keys: string[];
    readOnly?: boolean;
    required: string[];
    properties: {[k: string]: Property};
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: {};
};

type RestSchema =
    | {
          $ref: string;
      }
    | {
          type: 'array';
          items:
              | {
                    $ref: string;
                }
              | {
                    type:
                        | 'object'
                        | 'boolean'
                        | 'string'
                        | 'number'
                        | 'integer';
                };
      };
export type PathParameter = {
    name: string;
    in: 'query' | 'path' | 'body';
    description: string;
    required?: boolean;
    // query only
    allowEmptyValue?: boolean;
} & Property;
// TODO
export type ExternalDocumentationObject = {};

/**
 * https://swagger.io/specification/#parameterObject
 */
export type ParameterObject = {
    name: string;
    // TODO break into sep types by `in`
    in: 'query' | 'header' | 'path' | 'cookie';
    description: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
};

/**
 * https://swagger.io/specification/#referenceObject
 */
export type ReferenceObject = {
    $ref: string;
};

// TODO
export type RequestBodyObject = {};
// TODO
export type SecurityRequirementObject = {};

/**
 * https://swagger.io/specification/#serverVariableObject
 */
export type ServerVariableObject = {
    enum?: string[];
    default: string;
    description?: string;
};

/**
 * https://swagger.io/specification/#serverObject
 */
export type ServerObject = {
    url: string;
    description: string;
    variables: {
        [n: string]: ServerVariableObject;
    };
};
// TODO
export type CallbackObject = {};
/**
 * https://swagger.io/specification/#operationObject
 */
export type OperationObject = {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId: string;
    // parameters: PathParameter[];
    parameters: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses: {
        [responseCode: string]: {
            description: string;
            schema?: RestSchema;
        };
    };
    callbacks?: {
        [s: string]: CallbackObject | ReferenceObject;
    };
    deprecated?: boolean;
    consumes: string[];
    security: SecurityRequirementObject[];
    servers: ServerObject[];
};

/**
 * https://swagger.io/specification/#pathItemObject
 */
export type PathItemObject = {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: OperationObject;
    post?: OperationObject;
    put?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: (ParameterObject | ReferenceObject)[];
};

/**
 * https://swagger.io/specification/#pathsObject
 */
export type PathsObject = {
    [m: string]: PathItemObject;
};

// TODO
export type SchemaObject = {};
// TODO
export type ResponseObject = {};
// TODO
export type ExampleObject = {};
// TODO
export type HeaderObject = {};
// TODO
export type SecuritySchemeObject = {};
// TODO
export type LinkObject = {};

/**
 * https://swagger.io/specification/#componentsObject
 */
export type ComponentsObject = {
    schemas: {
        [m: string]: SchemaObject | ReferenceObject;
    };
    responses: {
        [m: string]: ResponseObject | ReferenceObject;
    };
    parameters: {
        [m: string]: ParameterObject | ReferenceObject;
    };
    examples: {
        [m: string]: ExampleObject | ReferenceObject;
    };
    requestBodies: {
        [m: string]: RequestBodyObject | ReferenceObject;
    };
    headers: {
        [m: string]: HeaderObject | ReferenceObject;
    };
    securitySchemes: {
        [m: string]: SecuritySchemeObject | ReferenceObject;
    };
    links: {
        [m: string]: LinkObject | ReferenceObject;
    };
    callbacks: {
        [m: string]: CallbackObject | ReferenceObject;
    };
};

/**
 * https://swagger.io/specification/#tagObject
 */
export type TagObject = {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
};

/**
 * https://swagger.io/specification/#openapi-object
 */
export type OpenAPIObject = {
    /**
     * Semantic version numver
     */
    openapi: string; // semantic version
    info: InfoObject;
    servers?: ServerObject[];
    paths: PathsObject;
    components?: ComponentsObject;
    security?: SecurityRequirementObject[];
    tags: TagObject[];
    externalDocs?: ExternalDocumentationObject;

    // below are questionable
    swagger: string;
    host: string;
    basePath: string;
    definitions: {
        [k: string]: Property;
    };
};

export type LintError = {
    name: string;
    msg: string;
};

export type Rule = {
    name: string;
    check: (a: OpenAPIObject, b: string[], c?: Config) => LintError[];
};
