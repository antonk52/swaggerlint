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

export type LintError = {
    name: string;
    msg: string;
    location: string[];
};

export type Report = (msg: string, location?: string[]) => void;
export type RuleVisitorFunction<T> = (a: {
    node: T;
    location: string[];
    report: Report;
    setting: SwaggerlintRuleSetting; // TODO
    config: SwaggerlintConfig; // TODO move this and above into rule arg
}) => void;

export type SwaggerVisitorName = keyof SwaggerRuleVisitor;

export type SwaggerRuleVisitor = Partial<{
    SwaggerObject: RuleVisitorFunction<Swagger.SwaggerObject>;
    InfoObject: RuleVisitorFunction<Swagger.InfoObject>;
    PathsObject: RuleVisitorFunction<Swagger.PathsObject>;

    DefinitionsObject: RuleVisitorFunction<Swagger.DefinitionsObject>;
    ParametersDefinitionsObject: RuleVisitorFunction<
        Swagger.ParametersDefinitionsObject
    >;
    ResponsesDefinitionsObject: RuleVisitorFunction<
        Swagger.ResponsesDefinitionsObject
    >;
    SecurityDefinitionsObject: RuleVisitorFunction<
        Swagger.SecurityDefinitionsObject
    >;
    SecuritySchemeObject: RuleVisitorFunction<Swagger.SecuritySchemeObject>;
    ScopesObject: RuleVisitorFunction<Swagger.ScopesObject>;
    SecurityRequirementObject: RuleVisitorFunction<
        Swagger.SecurityRequirementObject
    >;
    TagObject: RuleVisitorFunction<Swagger.TagObject>;
    ExternalDocumentationObject: RuleVisitorFunction<
        Swagger.ExternalDocumentationObject
    >;
    ContactObject: RuleVisitorFunction<Swagger.ContactObject>;
    LicenseObject: RuleVisitorFunction<Swagger.LicenseObject>;
    PathItemObject: RuleVisitorFunction<Swagger.PathItemObject>;
    OperationObject: RuleVisitorFunction<Swagger.OperationObject>;
    ParameterObject: RuleVisitorFunction<Swagger.ParameterObject>;
    ResponsesObject: RuleVisitorFunction<Swagger.ResponsesObject>;
    ResponseObject: RuleVisitorFunction<Swagger.ResponseObject>;
    SchemaObject: RuleVisitorFunction<Swagger.SchemaObject>;
    XMLObject: RuleVisitorFunction<Swagger.XMLObject>;
    HeadersObject: RuleVisitorFunction<Swagger.HeadersObject>;
    HeaderObject: RuleVisitorFunction<Swagger.HeaderObject>;
    ItemsObject: RuleVisitorFunction<Swagger.ItemsObject>;
    ExampleObject: RuleVisitorFunction<Swagger.ExampleObject>;
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

// prettier-ignore
export type OpenAPIVisitors = {
    CallbackObject: NodeWithLocation<OpenAPI.CallbackObject>[];
    ComponentsObject: OneOrNone<NodeWithLocation<OpenAPI.ComponentsObject>>;
    ContactObject: NodeWithLocation<OpenAPI.ContactObject>[];
    DiscriminatorObject: NodeWithLocation<OpenAPI.DiscriminatorObject>[];
    EncodingObject: NodeWithLocation<OpenAPI.EncodingObject>[];
    ExampleObject: NodeWithLocation<OpenAPI.ExampleObject>[];
    ExternalDocumentationObject: NodeWithLocation<OpenAPI.ExternalDocumentationObject>[];
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
    SecurityRequirementObject: NodeWithLocation<OpenAPI.SecurityRequirementObject>[];
    SecuritySchemeObject: NodeWithLocation<OpenAPI.SecuritySchemeObject>[];
    ServerObject: NodeWithLocation<OpenAPI.ServerObject>[];
    ServerVariableObject: NodeWithLocation<OpenAPI.ServerVariableObject>[];
    TagObject: NodeWithLocation<OpenAPI.TagObject>[];
    XMLObject: NodeWithLocation<OpenAPI.XMLObject>[];
};

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

export type OpenAPIVisitorName = keyof OpenAPIRuleVisitor;

type OpenAPIRuleVisitor = Partial<{
    CallbackObject: RuleVisitorFunction<OpenAPI.CallbackObject>;
    ComponentsObject: RuleVisitorFunction<OpenAPI.ComponentsObject>;
    ContactObject: RuleVisitorFunction<OpenAPI.ContactObject>;
    DiscriminatorObject: RuleVisitorFunction<OpenAPI.DiscriminatorObject>;
    EncodingObject: RuleVisitorFunction<OpenAPI.EncodingObject>;
    ExampleObject: RuleVisitorFunction<OpenAPI.ExampleObject>;
    ExternalDocumentationObject: RuleVisitorFunction<
        OpenAPI.ExternalDocumentationObject
    >;
    HeaderObject: RuleVisitorFunction<OpenAPI.HeaderObject>;
    InfoObject: RuleVisitorFunction<OpenAPI.InfoObject>;
    LicenseObject: RuleVisitorFunction<OpenAPI.LicenseObject>;
    LinkObject: RuleVisitorFunction<OpenAPI.LinkObject>;
    MediaTypeObject: RuleVisitorFunction<OpenAPI.MediaTypeObject>;
    OAuthFlowObject: RuleVisitorFunction<OpenAPI.OAuthFlowObject>;
    OAuthFlowsObject: RuleVisitorFunction<OpenAPI.OAuthFlowsObject>;
    OpenAPIObject: RuleVisitorFunction<OpenAPI.OpenAPIObject>;
    OperationObject: RuleVisitorFunction<OpenAPI.OperationObject>;
    ParameterObject: RuleVisitorFunction<OpenAPI.ParameterObject>;
    PathItemObject: RuleVisitorFunction<OpenAPI.PathItemObject>;
    PathsObject: RuleVisitorFunction<OpenAPI.PathsObject>;
    ReferenceObject: RuleVisitorFunction<OpenAPI.ReferenceObject>;
    RequestBodyObject: RuleVisitorFunction<OpenAPI.RequestBodyObject>;
    ResponseObject: RuleVisitorFunction<OpenAPI.ResponseObject>;
    ResponsesObject: RuleVisitorFunction<OpenAPI.ResponsesObject>;
    SchemaObject: RuleVisitorFunction<OpenAPI.SchemaObject>;
    SecurityRequirementObject: RuleVisitorFunction<
        OpenAPI.SecurityRequirementObject
    >;
    SecuritySchemeObject: RuleVisitorFunction<OpenAPI.SecuritySchemeObject>;
    ServerObject: RuleVisitorFunction<OpenAPI.ServerObject>;
    ServerVariableObject: RuleVisitorFunction<OpenAPI.ServerVariableObject>;
    TagObject: RuleVisitorFunction<OpenAPI.TagObject>;
    XMLObject: RuleVisitorFunction<OpenAPI.XMLObject>;
}>;

type SwaggerlintRulePrimitive = {
    name: string;
    openapiVisitor?: OpenAPIRuleVisitor;
    swaggerVisitor?: SwaggerRuleVisitor;
};

type SwaggerlintRuleWithSetting = SwaggerlintRulePrimitive & {
    /**
     * Verification of valid setting for the rule,
     * no need to verify boolean settings.
     */
    isValidSetting: (
        setting: SwaggerlintRuleSetting,
    ) => boolean | {msg: string};
    defaultSetting: SwaggerlintRuleSetting;
};

export type SwaggerlintRule =
    | SwaggerlintRulePrimitive
    | SwaggerlintRuleWithSetting;
