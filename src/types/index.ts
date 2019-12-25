import {SwaggerObject} from './swagger';

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

export type Config = {
    rules: {
        [ruleName: string]: [string] | [];
    };
    ignore?: {
        definitions?: string[];
    };
};

export type LintError = {
    name: string;
    msg: string;
};

export type Rule = {
    name: string;
    check: (a: SwaggerObject, b: string[], c?: Config) => LintError[];
};
