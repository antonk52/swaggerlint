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

export type CliOptions = {
    version?: string | boolean;
    path?: string;
    url?: string;
    config?: string;
};

type ExitCode = 0 | 1;
export type CliResult = {
    code: ExitCode;
    errors: LintError[];
};

type RuleSetting = [string] | [];
export type Config = {
    rules: {
        [ruleName: string]: RuleSetting;
    };
    ignore?: {
        definitions?: string[];
    };
};

export type LintError = {
    name: string;
    msg: string;
};

type RuleVisitorFunction<T> = (a: {
    node: T;
    report: (m: string) => void;
    setting: [] | [string];
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

export type Rule = {
    name: string;
    check?: (a: SwaggerObject, b: string[], c?: Config) => LintError[];
    isValidSetting?: (setting: RuleSetting) => boolean | {msg: string};
    visitor: RuleVisitor;
};
