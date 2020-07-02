import {SwaggerlintRule} from '../../types';

const name = 'latin-definitions-only';

function hasNonLatinCharacters(str: string): boolean {
    return (
        str
            // def name may contain latin chars
            .replace(/[a-z]+/i, '')
            // or numerals
            .replace(/\d/gi, '').length > 0
    );
}

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        DefinitionsObject: ({node, report, location}): void => {
            Object.keys(node).forEach(name => {
                if (hasNonLatinCharacters(name)) {
                    report(
                        `Definition name "${name}" contains non latin characters.`,
                        [...location, name],
                    );
                }
            });
        },
    },
    openapiVisitor: {
        ComponentsObject: ({node, location, report}): void => {
            ([
                'schemas',
                'responses',
                'parameters',
                'examples',
                'requestBodies',
                'headers',
                'securitySchemes',
                'links',
                'callbacks',
            ] as const).forEach(compName => {
                const val = node[compName];
                if (val === undefined) return;
                Object.keys(val).forEach(recName => {
                    if (hasNonLatinCharacters(recName)) {
                        report(
                            `Definition name "${recName}" contains non latin characters.`,
                            [...location, compName, recName],
                        );
                    }
                });
            });
        },
    },
};

export default rule;
