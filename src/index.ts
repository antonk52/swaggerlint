import {OpenAPIObject, LintError, Config} from './types';

import rules from './rules';

export function swaggerlint(
    swagger: OpenAPIObject,
    lintConfig: Config,
): LintError[] {
    let errs: LintError[] = [];

    const checkRule = (ruleName: keyof Config['rules']) => {
        const check = rules[ruleName];
        const ruleOptions = lintConfig.rules[ruleName];

        if (typeof check !== 'function') {
            console.warn(`"${ruleName}" is not a valid rule name`);
            process.exit(1);
        }

        errs = errs.concat(check(swagger, ruleOptions, lintConfig));
    };

    Object.keys(lintConfig.rules).forEach(checkRule);

    return errs;
}
