import type {JSONSchema7} from 'json-schema';

import * as Swagger from './swagger';
import * as OpenAPI from './openapi';

export type CaseName = 'camel' | 'snake' | 'kebab' | 'constant' | 'pascal';

export type CliOptions = {
    _: string[];
    version?: string | boolean;
    v?: string | boolean;
    config?: string;
};

type ExitCode = 0 | 1;
export type EntryResult = {
    src: string;
    errors: LintError[];
    schema: Swagger.SwaggerObject | OpenAPI.OpenAPIObject | void;
};
export type CliResult = {
    code: ExitCode;
    results: EntryResult[];
};

type AbstractObject = Record<string, unknown>;

export type SwaggerlintRuleSetting =
    | [string, AbstractObject]
    | [string]
    | boolean;

export type ConfigIgnore = {
    /**
     * Swagger specific
     */
    definitions?: string[];
    /**
     * OpenAPI specific
     */
    components?: {
        schemas?: string[];
        responses?: string[];
        parameters?: string[];
        examples?: string[];
        requestBodies?: string[];
        headers?: string[];
        securitySchemes?: string[];
        links?: string[];
        callbacks?: string[];
    };
    paths?: string[];
};

export type SwaggerlintConfig = {
    extends?: string[];
    rules: {
        [ruleName: string]: SwaggerlintRuleSetting;
    };
    ignore?: ConfigIgnore;
};

type LintErrorPlain = {
    name: string;
    msg: string;
    location: string[];
};
type LintErrorWithMsgId = LintErrorPlain & {
    name: string;
    msg: string;
    location: string[];
    messageId: string;
    data?: Record<string, unknown>;
};
export type LintError = LintErrorPlain | LintErrorWithMsgId;

type ReportArgSimple = {
    message: string;
    location?: string[];
};
type ReportArgComplex<M extends string> = {
    messageId: M;
    /**
     * Object with data to populate the message template.
     */
    data?: Record<string, string | number>;
    location?: string[];
};
export type Report<M extends string> = (
    arg: ReportArgSimple | ReportArgComplex<M>,
) => void;
export type RuleVisitorFunction<T, MessageIds extends string> = (a: {
    node: T;
    location: string[];
    report: Report<MessageIds>;
    setting: SwaggerlintRuleSetting; // TODO
    config: SwaggerlintConfig; // TODO move this and above into rule arg
}) => void;

export type SwaggerVisitorName = keyof SwaggerRuleVisitor<''>;

export type SwaggerRuleVisitor<M extends string> = Partial<{
    SwaggerObject: RuleVisitorFunction<Swagger.SwaggerObject, M>;
    InfoObject: RuleVisitorFunction<Swagger.InfoObject, M>;
    PathsObject: RuleVisitorFunction<Swagger.PathsObject, M>;

    DefinitionsObject: RuleVisitorFunction<Swagger.DefinitionsObject, M>;
    ParametersDefinitionsObject: RuleVisitorFunction<
        Swagger.ParametersDefinitionsObject,
        M
    >;
    ResponsesDefinitionsObject: RuleVisitorFunction<
        Swagger.ResponsesDefinitionsObject,
        M
    >;
    SecurityDefinitionsObject: RuleVisitorFunction<
        Swagger.SecurityDefinitionsObject,
        M
    >;
    SecuritySchemeObject: RuleVisitorFunction<Swagger.SecuritySchemeObject, M>;
    ScopesObject: RuleVisitorFunction<Swagger.ScopesObject, M>;
    SecurityRequirementObject: RuleVisitorFunction<
        Swagger.SecurityRequirementObject,
        M
    >;
    TagObject: RuleVisitorFunction<Swagger.TagObject, M>;
    ExternalDocumentationObject: RuleVisitorFunction<
        Swagger.ExternalDocumentationObject,
        M
    >;
    ContactObject: RuleVisitorFunction<Swagger.ContactObject, M>;
    LicenseObject: RuleVisitorFunction<Swagger.LicenseObject, M>;
    PathItemObject: RuleVisitorFunction<Swagger.PathItemObject, M>;
    OperationObject: RuleVisitorFunction<Swagger.OperationObject, M>;
    ParameterObject: RuleVisitorFunction<Swagger.ParameterObject, M>;
    ResponsesObject: RuleVisitorFunction<Swagger.ResponsesObject, M>;
    ResponseObject: RuleVisitorFunction<Swagger.ResponseObject, M>;
    SchemaObject: RuleVisitorFunction<Swagger.SchemaObject, M>;
    XMLObject: RuleVisitorFunction<Swagger.XMLObject, M>;
    HeadersObject: RuleVisitorFunction<Swagger.HeadersObject, M>;
    HeaderObject: RuleVisitorFunction<Swagger.HeaderObject, M>;
    ItemsObject: RuleVisitorFunction<Swagger.ItemsObject, M>;
    ExampleObject: RuleVisitorFunction<Swagger.ExampleObject, M>;
}>;

type OneOrNone<T> = [T] | [];
export type NodeWithLocation<T> = {
    node: T;
    location: string[];
};

export type SwaggerVisitors = {
    SwaggerObject: [NodeWithLocation<Swagger.SwaggerObject>];
    InfoObject: [NodeWithLocation<Swagger.InfoObject>];
    PathsObject: [NodeWithLocation<Swagger.PathsObject>];

    DefinitionsObject: OneOrNone<NodeWithLocation<Swagger.DefinitionsObject>>;
    ParametersDefinitionsObject: OneOrNone<
        NodeWithLocation<Swagger.ParametersDefinitionsObject>
    >;
    ResponsesDefinitionsObject: OneOrNone<
        NodeWithLocation<Swagger.ResponsesDefinitionsObject>
    >;
    SecurityDefinitionsObject: OneOrNone<
        NodeWithLocation<Swagger.SecurityDefinitionsObject>
    >;
    SecuritySchemeObject: NodeWithLocation<Swagger.SecuritySchemeObject>[];
    ScopesObject: NodeWithLocation<Swagger.ScopesObject>[];
    SecurityRequirementObject: NodeWithLocation<
        Swagger.SecurityRequirementObject
    >[];
    TagObject: NodeWithLocation<Swagger.TagObject>[];
    ExternalDocumentationObject: NodeWithLocation<
        Swagger.ExternalDocumentationObject
    >[];
    ContactObject: OneOrNone<NodeWithLocation<Swagger.ContactObject>>;
    LicenseObject: OneOrNone<NodeWithLocation<Swagger.LicenseObject>>;
    PathItemObject: NodeWithLocation<Swagger.PathItemObject>[];
    OperationObject: NodeWithLocation<Swagger.OperationObject>[];
    ParameterObject: NodeWithLocation<Swagger.ParameterObject>[];
    ResponsesObject: NodeWithLocation<Swagger.ResponsesObject>[];
    ResponseObject: NodeWithLocation<Swagger.ResponseObject>[];
    SchemaObject: NodeWithLocation<Swagger.SchemaObject>[];
    XMLObject: NodeWithLocation<Swagger.XMLObject>[];
    HeadersObject: NodeWithLocation<Swagger.HeadersObject>[];
    HeaderObject: NodeWithLocation<Swagger.HeaderObject>[];
    ItemsObject: NodeWithLocation<Swagger.ItemsObject>[];
    ExampleObject: NodeWithLocation<Swagger.ExampleObject>[];
};

/* GENERATED_START(id:openapi;hash:524a9cad6706f174e378bd127f940b4a) This is generated content, do not modify by hand, to regenerate run "npm run update-types" */
export type OpenAPIVisitors = {
    CallbackObject: NodeWithLocation<OpenAPI.CallbackObject>[];
    ComponentsObject: [NodeWithLocation<OpenAPI.ComponentsObject>] | [];
    ContactObject: NodeWithLocation<OpenAPI.ContactObject>[];
    DiscriminatorObject: NodeWithLocation<OpenAPI.DiscriminatorObject>[];
    EncodingObject: NodeWithLocation<OpenAPI.EncodingObject>[];
    ExampleObject: NodeWithLocation<OpenAPI.ExampleObject>[];
    ExternalDocumentationObject: NodeWithLocation<
        OpenAPI.ExternalDocumentationObject
    >[];
    HeaderObject: NodeWithLocation<OpenAPI.HeaderObject>[];
    InfoObject: [NodeWithLocation<OpenAPI.InfoObject>];
    LicenseObject: NodeWithLocation<OpenAPI.LicenseObject>[];
    LinkObject: NodeWithLocation<OpenAPI.LinkObject>[];
    MediaTypeObject: NodeWithLocation<OpenAPI.MediaTypeObject>[];
    OAuthFlowObject: NodeWithLocation<OpenAPI.OAuthFlowObject>[];
    OAuthFlowsObject: NodeWithLocation<OpenAPI.OAuthFlowsObject>[];
    OpenAPIObject: [NodeWithLocation<OpenAPI.OpenAPIObject>];
    OperationObject: NodeWithLocation<OpenAPI.OperationObject>[];
    ParameterObject: NodeWithLocation<OpenAPI.ParameterObject>[];
    PathItemObject: NodeWithLocation<OpenAPI.PathItemObject>[];
    PathsObject: [NodeWithLocation<OpenAPI.PathsObject>];
    ReferenceObject: NodeWithLocation<OpenAPI.ReferenceObject>[];
    RequestBodyObject: NodeWithLocation<OpenAPI.RequestBodyObject>[];
    ResponseObject: NodeWithLocation<OpenAPI.ResponseObject>[];
    ResponsesObject: NodeWithLocation<OpenAPI.ResponsesObject>[];
    SchemaObject: NodeWithLocation<OpenAPI.SchemaObject>[];
    SecurityRequirementObject: NodeWithLocation<
        OpenAPI.SecurityRequirementObject
    >[];
    SecuritySchemeObject: NodeWithLocation<OpenAPI.SecuritySchemeObject>[];
    ServerObject: NodeWithLocation<OpenAPI.ServerObject>[];
    ServerVariableObject: NodeWithLocation<OpenAPI.ServerVariableObject>[];
    TagObject: NodeWithLocation<OpenAPI.TagObject>[];
    XMLObject: NodeWithLocation<OpenAPI.XMLObject>[];
};

export type OpenAPIVisitorName = keyof OpenAPIRuleVisitor<''>;

export type OpenAPITypes = {
    CallbackObject: OpenAPI.CallbackObject;
    ComponentsObject: OpenAPI.ComponentsObject;
    ContactObject: OpenAPI.ContactObject;
    DiscriminatorObject: OpenAPI.DiscriminatorObject;
    EncodingObject: OpenAPI.EncodingObject;
    ExampleObject: OpenAPI.ExampleObject;
    ExternalDocumentationObject: OpenAPI.ExternalDocumentationObject;
    HeaderObject: OpenAPI.HeaderObject;
    InfoObject: OpenAPI.InfoObject;
    LicenseObject: OpenAPI.LicenseObject;
    LinkObject: OpenAPI.LinkObject;
    MediaTypeObject: OpenAPI.MediaTypeObject;
    OAuthFlowObject: OpenAPI.OAuthFlowObject;
    OAuthFlowsObject: OpenAPI.OAuthFlowsObject;
    OpenAPIObject: OpenAPI.OpenAPIObject;
    OperationObject: OpenAPI.OperationObject;
    ParameterObject: OpenAPI.ParameterObject;
    PathItemObject: OpenAPI.PathItemObject;
    PathsObject: OpenAPI.PathsObject;
    ReferenceObject: OpenAPI.ReferenceObject;
    RequestBodyObject: OpenAPI.RequestBodyObject;
    ResponseObject: OpenAPI.ResponseObject;
    ResponsesObject: OpenAPI.ResponsesObject;
    SchemaObject: OpenAPI.SchemaObject;
    SecurityRequirementObject: OpenAPI.SecurityRequirementObject;
    SecuritySchemeObject: OpenAPI.SecuritySchemeObject;
    ServerObject: OpenAPI.ServerObject;
    ServerVariableObject: OpenAPI.ServerVariableObject;
    TagObject: OpenAPI.TagObject;
    XMLObject: OpenAPI.XMLObject;
};

type OpenAPIRuleVisitor<M extends string> = Partial<{
    CallbackObject: RuleVisitorFunction<OpenAPI.CallbackObject, M>;
    ComponentsObject: RuleVisitorFunction<OpenAPI.ComponentsObject, M>;
    ContactObject: RuleVisitorFunction<OpenAPI.ContactObject, M>;
    DiscriminatorObject: RuleVisitorFunction<OpenAPI.DiscriminatorObject, M>;
    EncodingObject: RuleVisitorFunction<OpenAPI.EncodingObject, M>;
    ExampleObject: RuleVisitorFunction<OpenAPI.ExampleObject, M>;
    ExternalDocumentationObject: RuleVisitorFunction<
        OpenAPI.ExternalDocumentationObject,
        M
    >;
    HeaderObject: RuleVisitorFunction<OpenAPI.HeaderObject, M>;
    InfoObject: RuleVisitorFunction<OpenAPI.InfoObject, M>;
    LicenseObject: RuleVisitorFunction<OpenAPI.LicenseObject, M>;
    LinkObject: RuleVisitorFunction<OpenAPI.LinkObject, M>;
    MediaTypeObject: RuleVisitorFunction<OpenAPI.MediaTypeObject, M>;
    OAuthFlowObject: RuleVisitorFunction<OpenAPI.OAuthFlowObject, M>;
    OAuthFlowsObject: RuleVisitorFunction<OpenAPI.OAuthFlowsObject, M>;
    OpenAPIObject: RuleVisitorFunction<OpenAPI.OpenAPIObject, M>;
    OperationObject: RuleVisitorFunction<OpenAPI.OperationObject, M>;
    ParameterObject: RuleVisitorFunction<OpenAPI.ParameterObject, M>;
    PathItemObject: RuleVisitorFunction<OpenAPI.PathItemObject, M>;
    PathsObject: RuleVisitorFunction<OpenAPI.PathsObject, M>;
    ReferenceObject: RuleVisitorFunction<OpenAPI.ReferenceObject, M>;
    RequestBodyObject: RuleVisitorFunction<OpenAPI.RequestBodyObject, M>;
    ResponseObject: RuleVisitorFunction<OpenAPI.ResponseObject, M>;
    ResponsesObject: RuleVisitorFunction<OpenAPI.ResponsesObject, M>;
    SchemaObject: RuleVisitorFunction<OpenAPI.SchemaObject, M>;
    SecurityRequirementObject: RuleVisitorFunction<
        OpenAPI.SecurityRequirementObject,
        M
    >;
    SecuritySchemeObject: RuleVisitorFunction<OpenAPI.SecuritySchemeObject, M>;
    ServerObject: RuleVisitorFunction<OpenAPI.ServerObject, M>;
    ServerVariableObject: RuleVisitorFunction<OpenAPI.ServerVariableObject, M>;
    TagObject: RuleVisitorFunction<OpenAPI.TagObject, M>;
    XMLObject: RuleVisitorFunction<OpenAPI.XMLObject, M>;
}>;
/* GENERATED_END(id:openapi) */

type SwaggerlintRulePrimitive<T extends string> = {
    name: string;
    docs: {
        description: string;
        recommended: boolean;
    };
    meta?: {
        messages?: Record<T, string>;
    };
    openapiVisitor?: OpenAPIRuleVisitor<T>;
    swaggerVisitor?: SwaggerRuleVisitor<T>;
};

type SwaggerlintRuleWithSetting<T extends string> = Omit<
    SwaggerlintRulePrimitive<T>,
    'meta'
> & {
    meta: SwaggerlintRulePrimitive<T>['meta'] & {
        schema: JSONSchema7;
    };
    /**
     * To be used when the user has `true` in the config
     */
    defaultSetting: SwaggerlintRuleSetting;
};

export type SwaggerlintRule<T extends string> =
    | SwaggerlintRulePrimitive<T>
    | SwaggerlintRuleWithSetting<T>;
