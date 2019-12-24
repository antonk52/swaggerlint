import {SwaggerObject} from './swagger';

export * from './swagger';

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
