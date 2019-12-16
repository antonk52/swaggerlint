/*
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

export type Info = {
    description: string;
    version: string;
    title: string;
    contact: {
        name: string;
        url: string;
        email: string;
    };
};
export type Tag = {
    name: string;
    description?: string;
    externalDocs?: any;
};
export type XMLObject = {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
};

export type PropBase<A = Object> = {
  title?: string,
  description?: string;
} & A;

export type PropString = PropBase<{
    type: 'string';
    format?: 'byte' | 'binary' | 'date' | 'date-time' | 'password';
    default?: string;
    enum?: string[];
}>;
export type PropInteger = PropBase<{
    type: 'integer';
    format?: 'int32' | 'int64';
    description?: string;
    default?: number;
    minimum?: number;
    maximum?: number;
}>;
export type PropNumber = PropBase<{
    type: 'number';
    format?: 'float' | 'double';
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
    | PropBoolean;
export type DefinitionObject = {
    title: string;
    description?: string;
    type: PlainType;
    keys: string[];
    readOnly?: boolean;
    required: string[];
    properties: {[k: string]: Property};
    xml?: XMLObject;
    externalDocs?: any;
    example?: any;
};
export type Swagger = {
    swagger: string;
    info: Info;
    host: string;
    basePath: string;
    tags: Tag[];
    // TODO
    paths: any;
    definitions: {
        [k: string]: Property;
    };
};

export type LintError = {
    name: string;
    msg: string;
};

export type Rule = {
    name: string,
    check: (a: Swagger, b: string[], c?: Config) => LintError[],
};
