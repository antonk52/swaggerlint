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

type SwaggerlintRuleSetting = [string, AbstractObject] | [string] | boolean;

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

type SwaggerRuleVisitor = Partial<{
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
