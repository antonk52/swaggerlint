import {
    SwaggerObject,
    InfoObject,
    PathsObject,
    DefinitionsObject,
    ParametersDefinitionsObject,
    ResponsesDefinitionsObject,
    SecurityDefinitionsObject,
    SecuritySchemeObject,
    ScopesObject,
    SecurityRequirementObject,
    TagObject,
    ExternalDocumentationObject,
    ContactObject,
    LicenseObject,
    PathItemObject,
    OperationObject,
    ParameterObject,
    ResponsesObject,
    ResponseObject,
    SchemaObject,
    XMLObject,
    HeadersObject,
    HeaderObject,
    ItemsObject,
    ExampleObject,
} from './swagger';

export * from './swagger';

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
    swagger: SwaggerObject | void;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type RuleSetting = [string, Record<string, any>] | [string] | boolean;
export type ConfigIgnore = {
    definitions?: string[];
    paths?: string[];
};
export type Config = {
    extends?: string[];
    rules: {
        [ruleName: string]: RuleSetting;
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
    setting: RuleSetting;
}) => void;

export type VisitorName = keyof RuleVisitor;

type RuleVisitor = Partial<{
    SwaggerObject: RuleVisitorFunction<SwaggerObject>;
    InfoObject: RuleVisitorFunction<InfoObject>;
    PathsObject: RuleVisitorFunction<PathsObject>;

    DefinitionsObject: RuleVisitorFunction<DefinitionsObject>;
    ParametersDefinitionsObject: RuleVisitorFunction<
        ParametersDefinitionsObject
    >;
    ResponsesDefinitionsObject: RuleVisitorFunction<ResponsesDefinitionsObject>;
    SecurityDefinitionsObject: RuleVisitorFunction<SecurityDefinitionsObject>;
    SecuritySchemeObject: RuleVisitorFunction<SecuritySchemeObject>;
    ScopesObject: RuleVisitorFunction<ScopesObject>;
    SecurityRequirementObject: RuleVisitorFunction<SecurityRequirementObject>;
    TagObject: RuleVisitorFunction<TagObject>;
    ExternalDocumentationObject: RuleVisitorFunction<
        ExternalDocumentationObject
    >;
    ContactObject: RuleVisitorFunction<ContactObject>;
    LicenseObject: RuleVisitorFunction<LicenseObject>;
    PathItemObject: RuleVisitorFunction<PathItemObject>;
    OperationObject: RuleVisitorFunction<OperationObject>;
    ParameterObject: RuleVisitorFunction<ParameterObject>;
    ResponsesObject: RuleVisitorFunction<ResponsesObject>;
    ResponseObject: RuleVisitorFunction<ResponseObject>;
    SchemaObject: RuleVisitorFunction<SchemaObject>;
    XMLObject: RuleVisitorFunction<XMLObject>;
    HeadersObject: RuleVisitorFunction<HeadersObject>;
    HeaderObject: RuleVisitorFunction<HeaderObject>;
    ItemsObject: RuleVisitorFunction<ItemsObject>;
    ExampleObject: RuleVisitorFunction<ExampleObject>;
}>;

type RulePrimitive = {
    name: string;
    visitor: RuleVisitor;
};
type RuleWithSetting = RulePrimitive & {
    isValidSetting: (setting: RuleSetting) => boolean | {msg: string};
    defaultSetting: RuleSetting;
};

export type Rule = RulePrimitive | RuleWithSetting;
