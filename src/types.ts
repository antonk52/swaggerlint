/**
 * All types and their names should mimic the swagger spec (2.0).
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
 *
 * or
 *
 * https://swagger.io/specification/v2/
 *
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Config = {
    rules: {
        [ruleName: string]: [string] | [];
    };
    ignore?: {
        definitions?: string[];
    };
};

/**
 * https://swagger.io/specification/v2/#contactObject
 */
export type ContactObject = {
    name?: string;
    url?: string;
    email?: string;
};

/**
 * https://swagger.io/specification/v2/#licenseObject
 */
export type LicenseObject = {
    name: string;
    url?: string;
    [s: string]: any;
};

/**
 * https://swagger.io/specification/v2/#infoObject
 */
export type InfoObject = {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    licence?: LicenseObject;
    version: string;
};

/**
 * https://swagger.io/specification/v2/#xmlObject
 */
export type XMLObject = {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
};

/**
 * https://swagger.io/specification/v2/#externalDocumentationObject
 */
export type ExternalDocumentationObject = {
    url: string;
    description?: string;
};

/**
 * https://swagger.io/specification/v2/#itemsObject
 */
type CommonItemsObject = {
    format?: string;
    default?: any;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    enum?: any[];
    multipleOf?: number;
};
type ItemsObject =
    | ({
          type: 'array';
          items: ItemsObject;
          collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes';
      } & CommonItemsObject)
    | ({
          type: 'string' | 'number' | 'integer' | 'boolean';
      } & CommonItemsObject);

/**
 * https://swagger.io/specification/v2/#parameterObject
 */
type CommonParameterObject = {
    format?: string;
    allowEmptyValue?: boolean;
    default?: any;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    enum?: any[];
    multipleOf?: number;
};
export type ParameterObject =
    /**
     * - in `body` parameter has `schema` property
     * - no common properties
     */
    | {
          name: string;
          in: 'body';
          description: string;
          required?: boolean;
          schema: SchemaObject;
      }
    /**
     * in `path` parameter is always required
     */
    | ({
          name: string;
          in: 'path';
          required: true;
      } & CommonParameterObject)
    | ({
          name: string;
          in: 'query' | 'header' | 'formData';
          description: string;
          required?: boolean;
          type: 'string' | 'number' | 'integer' | 'boolean' | 'file';
      } & CommonParameterObject)
    /**
     * type array has `items` & optional `collectionFormat` properties
     */
    | ({
          name: string;
          in: 'query' | 'header' | 'formData';
          description: string;
          required?: boolean;
          type: 'array';
          items: ItemsObject;
          collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';
      } & CommonParameterObject);

/**
 * https://swagger.io/specification/v2/#referenceObject
 */
export type ReferenceObject = {$ref: string};

/**
 * https://swagger.io/specification/v2/#security-requirement-object
 */
export type SecurityRequirementObject = {
    [name: string]: string[];
};

/**
 * https://swagger.io/specification/v2/#responsesObject
 */
export type ResponsesObject = {
    default: ResponseObject | ReferenceObject;
    [httpStatusCode: string]: ResponseObject | ReferenceObject;
};

/**
 * https://swagger.io/specification/v2/#operationObject
 */
export type OperationObject = {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    consumes?: string[];
    produces?: string[];
    parameters?: (ParameterObject | ReferenceObject)[];
    responses: ResponsesObject;
    schemes?: ('http' | 'https' | 'ws' | 'wss')[];
    deprecated?: boolean;
    security: SecurityRequirementObject[];
};

/**
 * https://swagger.io/specification/v2/#pathItemObject
 */
export type PathItemObject =
    | ReferenceObject
    | {
          get?: OperationObject;
          put?: OperationObject;
          post?: OperationObject;
          delete?: OperationObject;
          options?: OperationObject;
          head?: OperationObject;
          patch?: OperationObject;
          trace?: OperationObject;
          parameters?: (ParameterObject | ReferenceObject)[];
      };

/**
 * https://swagger.io/specification/v2/#pathsObject
 */
export type PathsObject = {
    [m: string]: PathItemObject;
};

/**
 * https://swagger.io/specification/v2/#schemaObject
 */
export type DataType = 'integer' | 'number' | 'string' | 'boolean';
type IntegerFormat = 'int32' | 'int64';
type NumberFormat = 'float' | 'double';
type StringFormat =
    | 'byte'
    | 'binary'
    | 'date'
    | 'date-time'
    | 'password'
    | 'email'
    | 'uuid';
type SchemaObjectCreator<T, F, D> = {
    format?: F;
    type?: T;
    title?: string;
    description?: string;
    default?: D;
    enum?: D[];
};

type NumberAddon = Partial<{
    maximum: number;
    exclusiveMaximum: boolean;
    minimum: number;
    exclusiveMinimum: boolean;
    multipleOf?: number;
}>;
type StringAddon = Partial<{
    maxLength: number;
    minLength: number;
    pattern: string;
}>;
type ArrayAddon = Partial<{
    maxItems: number;
    minItems: number;
    uniqueItems: boolean;
}>;
type ObjectAddon = Partial<{
    maxProperties: number;
    minProperties: number;
    required: string[];
    additionalProperties: boolean | Record<string, any>;
    properties: {[name: string]: SchemaObject};
}>;
export type SchemaObject =
    | ReferenceObject
    | (SchemaObjectCreator<'integer', IntegerFormat, number> & NumberAddon)
    | (SchemaObjectCreator<'number', NumberFormat, number> & NumberAddon)
    | (SchemaObjectCreator<'string', StringFormat, string> & StringAddon)
    | SchemaObjectCreator<'boolean', any, boolean>
    | (SchemaObjectCreator<'object', any, Record<string, any>> & ObjectAddon)
    | (SchemaObjectCreator<'array', any, SchemaObject[]> & {
          items: SchemaObject;
      } & ArrayAddon);

/**
 * https://swagger.io/specification/v2/#headers-object
 */
type HeadersObject = {
    [name: string]: HeaderObject;
};

/**
 * https://swagger.io/specification/v2/#responseObject
 */
export type ResponseObject = {
    description: string;
    schema?: SchemaObject;
    headers?: HeadersObject;
    examples?: ExampleObject;
};

/**
 * https://swagger.io/specification/v2/#example-object
 */
export type ExampleObject = {
    [mineType: string]: any;
};

/**
 * https://swagger.io/specification/v2/#headerObject
 */
type CommonHeaderObject<T> = {
    description?: string;
    format?: string;
    default?: T;
    enum?: T[];
};
export type HeaderObject =
    | ({
          type: 'boolean';
      } & CommonHeaderObject<boolean>)
    | ({
          type: 'number' | 'integer';
          maximum?: number;
          exclusiveMaximum?: boolean;
          minimum?: number;
          exclusiveMinimum?: boolean;
          multipleOf?: number;
      } & CommonHeaderObject<number>)
    | ({
          type: 'string';
          maxLength?: number;
          minLength?: number;
          pattern?: string;
      } & CommonHeaderObject<string>)
    | ({
          type: 'array';
          items: ItemsObject;
          /**
           * default 'csv'
           */
          collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes';
          maxItems?: number;
          minItems?: number;
          uniqueItems?: boolean;
      } & CommonHeaderObject<any>);

/**
 * https://swagger.io/specification/v2/#security-scheme-object
 */
export type SecuritySchemeObject = {
    type: string;
    description?: string;
    name: string;
    in: 'query' | 'header';
    flow: 'implicit' | 'password' | 'application' | 'accessCode';
    authorizationUrl: string;
    tokenUrl: string;
    scopes: ScopesObject;
};

/**
 * https://swagger.io/specification/v2/#scopes-object
 */
type ScopesObject = {
    [name: string]: string;
};

/**
 * https://swagger.io/specification/v2/#tagObject
 */
export type TagObject = {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
};

/**
 * https://swagger.io/specification/v2/#parametersDefinitionsObject
 */
type ParametersDefinitionsObject = {
    [name: string]: ParameterObject;
};

/**
 * https://swagger.io/specification/v2/#responses-definitions-object
 */
type ResponsesDefinitionsObject = {
    [name: string]: ResponseObject;
};

/**
 * https://swagger.io/specification/v2/#securityDefinitionsObject
 */
type SecurityDefinitionsObject = {
    [name: string]: SecuritySchemeObject;
};

/**
 * https://swagger.io/specification/v2/#definitionsObject
 */
type DefinitionsObject = {
    [name: string]: SchemaObject;
};

/**
 * https://swagger.io/specification/v2/#swagger-object
 */
export type SwaggerObject = {
    swagger: '2.0';
    info: InfoObject;
    host?: string;
    basePath?: string;
    schemes?: ('http' | 'https' | 'ws' | 'wss')[];
    consumes?: string[];
    produces?: string[];
    paths: PathsObject;
    definitions?: DefinitionsObject;
    parameters?: ParametersDefinitionsObject;
    responses?: ResponsesDefinitionsObject;
    securityDefinitions?: SecurityDefinitionsObject;
    security?: SecurityRequirementObject[];
    tags: TagObject[];
    externalDocs?: ExternalDocumentationObject;
};

export type LintError = {
    name: string;
    msg: string;
};

export type Rule = {
    name: string;
    check: (a: SwaggerObject, b: string[], c?: Config) => LintError[];
};
