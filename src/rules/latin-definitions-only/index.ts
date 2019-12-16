import {Rule, LintError} from '../../types';

const name = 'latin-definitions-only';

const rule: Rule = {
    name,
    check: (swagger, _) => {
        const errors: LintError[] = [];

        Object.keys(swagger.definitions).forEach(definition => {
            const rest = definition
                // def name may contain latin chars
                .replace(/[a-z]+/i, '')
                // or numerals
                .replace(/\d/gi, '');

            if (rest.length > 0) {
                errors.push({
                    msg: `Definition name "${definition}" contains non latin characters.`,
                    name,
                });
            }
        });

        return errors;
    },
};

export default rule;
