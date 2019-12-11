/*
 * TODO
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
 */
export type Config = {
    rules: {
        [ruleName: string]: string[];
    };
};

export type Validator = (a: Swagger, b: string[]) => LintError[];
export type Validators = {[k: string]: Validator};
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

export type PropString = {
    type: 'string';
    format?: 'byte' | 'binary' | 'date' | 'date-time' | 'password';
    description?: string;
    default?: string;
    enum?: string[];
};
export type PropInteger = {
    type: 'integer';
    format?: 'int32' | 'int64';
    description?: string;
    default?: number;
    minimum?: number;
    maximum?: number;
};
export type PropNumber = {
    type: 'number';
    format?: 'float' | 'double';
    description?: string;
    default?: number;
    minimum?: number;
    maximum?: number;
};
export type PropBoolean = {
    type: 'boolean';
    description?: string;
    default?: boolean;
};
export type PropObject = {
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
};
export type Property =
    | PropObject
    | PropString
    | PropInteger
    | PropNumber
    | PropBoolean;
export type DefinitionObject = {
    title: string;
    description?: string;
    type: 'object' | 'boolean' | 'string' | 'number' | 'integer';
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
    paths: any;
    definitions: {
        [k: string]: Property;
    };
};

export type LintError = {
    name: string;
    msg: string;
    source: string;
};
