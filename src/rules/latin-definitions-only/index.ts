import {componentsKeys} from '../../utils/openapi';
import {createRule} from '../../utils';

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

const rule = createRule({
    name,
    meta: {
        messages: {
            msg: `Definition name "{{name}}" contains non latin characters.`,
        },
    },
    swaggerVisitor: {
        DefinitionsObject: ({node, report, location}): void => {
            const definitionNames = Object.keys(node);
            definitionNames.forEach(name => {
                if (hasNonLatinCharacters(name)) {
                    report({
                        messageId: 'msg',
                        data: {
                            name,
                        },
                        location: [...location, name],
                    });
                }
            });
        },
    },
    openapiVisitor: {
        ComponentsObject: ({node, location, report}): void => {
            componentsKeys.forEach(compName => {
                const val = node[compName];
                if (val === undefined) return;
                Object.keys(val).forEach(recName => {
                    if (hasNonLatinCharacters(recName)) {
                        report({
                            messageId: 'msg',
                            data: {
                                name: recName,
                            },
                            location: [...location, compName, recName],
                        });
                    }
                });
            });
        },
    },
});

export default rule;
