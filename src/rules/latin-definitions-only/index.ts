import {SwaggerlintRule} from '../../types';

const name = 'latin-definitions-only';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        DefinitionsObject: ({node, report}): void => {
            Object.keys(node).forEach(name => {
                const rest = name
                    // def name may contain latin chars
                    .replace(/[a-z]+/i, '')
                    // or numerals
                    .replace(/\d/gi, '');

                if (rest.length > 0) {
                    report(
                        `Definition name "${name}" contains non latin characters.`,
                    );
                }
            });
        },
    },
};

export default rule;
