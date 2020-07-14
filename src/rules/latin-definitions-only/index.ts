import {SwaggerlintRule} from '../../types';
import {componentsKeys} from '../../utils/openapi';

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
        SchemaObject: ({report, location}): void => {
            if (location.length === 2 && location[0] === 'definitions') {
                const [, name] = location;
                if (hasNonLatinCharacters(name)) {
                    report(
                        `Definition name "${name}" contains non latin characters.`,
                        location,
                    );
                }
            }
        },
    },
    openapiVisitor: {
        ComponentsObject: ({node, location, report}): void => {
            componentsKeys.forEach(compName => {
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
