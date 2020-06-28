import {SwaggerlintRule} from '../../types';

const name = 'latin-definitions-only';

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        DefinitionsObject: ({node, report, location}): void => {
            Object.keys(node).forEach(name => {
                const rest = name
                    // def name may contain latin chars
                    .replace(/[a-z]+/i, '')
                    // or numerals
                    .replace(/\d/gi, '');

                if (rest.length > 0) {
                    report(
                        `Definition name "${name}" contains non latin characters.`,
                        [...location, name],
                    );
                }
            });
        },
    },
};

export default rule;
