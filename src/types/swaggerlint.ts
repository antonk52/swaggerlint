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
export type CliResult = {
    code: ExitCode;
    errors: LintError[];
    schema: Swagger.SwaggerObject | OpenAPI.OpenAPIObject | void;
};

type AbstractObject = Record<string, unknown>;

export type SwaggerlintRuleSetting =
    | [string, AbstractObject]
    | [string]
    | boolean;

export type ConfigIgnore = {
    definitions?: string[];
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
type RuleVisitorFunction<T> = (a: {
    node: T;
    location: string[];
    report: Report;
    setting: SwaggerlintRuleSetting;
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
type NodeWithLocation<T> = {
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
    OpenAPIObject: [NodeWithLocation<OpenAPI.OpenAPIObject>];
    InfoObject: [NodeWithLocation<OpenAPI.InfoObject>];
    PathsObject: [NodeWithLocation<OpenAPI.PathsObject>];
    PathItemObject: NodeWithLocation<OpenAPI.PathItemObject>[];
    OperationObject: NodeWithLocation<OpenAPI.OperationObject>[];
    ServerObject: NodeWithLocation<OpenAPI.ServerObject>[];
    ServerVariableObject: NodeWithLocation<OpenAPI.ServerVariableObject>[];

    ComponentsObject: OneOrNone<NodeWithLocation<OpenAPI.ComponentsObject>>;
        SchemaObject: NodeWithLocation<OpenAPI.SchemaObject>[];
        DiscriminatorObject: NodeWithLocation<OpenAPI.DiscriminatorObject>[];
        XMLObject: NodeWithLocation<OpenAPI.XMLObject>[];
        ResponseObject: NodeWithLocation<OpenAPI.ResponseObject>[];
        ParameterObject: NodeWithLocation<OpenAPI.ParameterObject>[];
        MediaTypeObject: NodeWithLocation<OpenAPI.MediaTypeObject>[];
        EncodingObject: NodeWithLocation<OpenAPI.EncodingObject>[];
        ExampleObject: NodeWithLocation<OpenAPI.ExampleObject>[];
        RequestBodyObject: NodeWithLocation<OpenAPI.RequestBodyObject>[];
        HeaderObject: NodeWithLocation<OpenAPI.HeaderObject>[];
        SecuritySchemeObject: NodeWithLocation<OpenAPI.SecuritySchemeObject>[];
        LinkObject: NodeWithLocation<OpenAPI.LinkObject>[];
        CallbackObject: NodeWithLocation<OpenAPI.CallbackObject>[];
    SecurityRequirementObject: NodeWithLocation<OpenAPI.SecurityRequirementObject>[];
    TagObject: NodeWithLocation<OpenAPI.TagObject>[];
    ExternalDocumentationObject: NodeWithLocation<OpenAPI.ExternalDocumentationObject>[];

    ReferenceObject: NodeWithLocation<OpenAPI.ReferenceObject>[];
};

export type OpenAPIVisitorName = keyof OpenAPIRuleVisitor;

type OpenAPIRuleVisitor = Partial<{
    DiscriminatorObject: RuleVisitorFunction<OpenAPI.DiscriminatorObject>;
    XMLObject: RuleVisitorFunction<OpenAPI.XMLObject>;
    SchemaObject: RuleVisitorFunction<OpenAPI.SchemaObject>;
    SpecificationExtensions: RuleVisitorFunction<
        OpenAPI.SpecificationExtensions
    >;
    LicenseObject: RuleVisitorFunction<OpenAPI.LicenseObject>;
    ContactObject: RuleVisitorFunction<OpenAPI.ContactObject>;
    InfoObject: RuleVisitorFunction<OpenAPI.InfoObject>;
    ServerVariableObject: RuleVisitorFunction<OpenAPI.ServerVariableObject>;
    ServerObject: RuleVisitorFunction<OpenAPI.ServerObject>;
    ExternalDocumentationObject: RuleVisitorFunction<
        OpenAPI.ExternalDocumentationObject
    >;
    TagObject: RuleVisitorFunction<OpenAPI.TagObject>;
    SecurityRequirementObject: RuleVisitorFunction<
        OpenAPI.SecurityRequirementObject
    >;
    ReferenceObject: RuleVisitorFunction<OpenAPI.ReferenceObject>;
    CallbackObject: RuleVisitorFunction<OpenAPI.CallbackObject>;
    RuntimeExpression: RuleVisitorFunction<OpenAPI.RuntimeExpression>;
    LinkObject: RuleVisitorFunction<OpenAPI.LinkObject>;
    OAuthFlowObject: RuleVisitorFunction<OpenAPI.OAuthFlowObject>;
    OAuthFlowsObject: RuleVisitorFunction<OpenAPI.OAuthFlowsObject>;
    SecuritySchemeObject: RuleVisitorFunction<OpenAPI.SecuritySchemeObject>;
    ExampleObject: RuleVisitorFunction<OpenAPI.ExampleObject>;
    EncodingObject: RuleVisitorFunction<OpenAPI.EncodingObject>;
    MediaTypeObject: RuleVisitorFunction<OpenAPI.MediaTypeObject>;
    RequestBodyObject: RuleVisitorFunction<OpenAPI.RequestBodyObject>;
    ParameterObject: RuleVisitorFunction<OpenAPI.ParameterObject>;
    HeaderObject: RuleVisitorFunction<OpenAPI.HeaderObject>;
    ResponseObject: RuleVisitorFunction<OpenAPI.ResponseObject>;
    ResponsesObject: RuleVisitorFunction<OpenAPI.ResponsesObject>;
    OperationObject: RuleVisitorFunction<OpenAPI.OperationObject>;
    PathItemObject: RuleVisitorFunction<OpenAPI.PathItemObject>;
    PathsObject: RuleVisitorFunction<OpenAPI.PathsObject>;
    ComponentsObject: RuleVisitorFunction<OpenAPI.ComponentsObject>;
}>;

type SwaggerlintRulePrimitive = {
    name: string;
    visitor: SwaggerRuleVisitor;
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
