import escapeStringRegexp from 'escape-string-regexp';
import {componentsKeys} from '../../utils/openapi';
import {createRule} from '../../utils';

const name = 'latin-definitions-only';

function replaceLatinCharacters(str: string): string {
    return (
        str
            // def name may contain latin chars
            .replace(/[a-z]+/gi, '')
            // or numerals
            .replace(/\d/gi, '')
    );
}

function replaceIgnoredChars(str: string, ignoredChars: string[]): string {
    if (ignoredChars.length === 0) return str;

    const re = new RegExp(
        `[${ignoredChars.map(x => escapeStringRegexp(x)).join('')}]`,
        'g',
    );
    return str.replace(re, '');
}

const rule = createRule({
    name,
    docs: {
        recommended: true,
        description: 'Bans non Latin characters usage in definition names',
    },
    meta: {
        messages: {
            msg: `Definition name "{{name}}" contains non latin characters.`,
        },
        schema: {
            type: 'array',
            items: [
                {
                    type: 'string',
                },
                {
                    type: 'object',
                    required: ['ignore'],
                    properties: {
                        ignore: {
                            type: 'array',
                            items: {
                                type: 'string',
                                minLength: 1,
                                maxLength: 1,
                            },
                        },
                    },
                },
            ],
            minItems: 1,
            maxItems: 2,
        },
    },
    swaggerVisitor: {
        DefinitionsObject: ({node, report, location, setting}): void => {
            const charsToIgnore = (Array.isArray(setting)
                ? setting[1]?.ignore || []
                : []) as string[];
            const definitionNames = Object.keys(node);
            definitionNames.forEach(name => {
                const cleanStr = replaceLatinCharacters(name);
                const rest = replaceIgnoredChars(cleanStr, charsToIgnore);

                if (rest.length > 0) {
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
        ComponentsObject: ({node, location, report, setting}): void => {
            const charsToIgnore = (Array.isArray(setting)
                ? setting[1]?.ignore || []
                : []) as string[];
            componentsKeys.forEach(compName => {
                const val = node[compName];
                if (val === undefined) return;
                Object.keys(val).forEach(recName => {
                    const cleanStr = replaceLatinCharacters(recName);
                    const rest = replaceIgnoredChars(cleanStr, charsToIgnore);

                    if (rest.length > 0) {
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
    defaultSetting: ['placeholder_to_be_removed', {ignore: []}],
});

export default rule;
