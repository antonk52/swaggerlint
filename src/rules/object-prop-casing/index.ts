import Case from 'case';
import {createRule} from '../../utils';
import {validCases, isValidCaseName} from '../../utils';

const name = 'object-prop-casing';

const rule = createRule({
    name,
    docs: {
        recommended: true,
        description: 'Casing for your object property names',
    },
    meta: {
        messages: {
            casing:
                'Property "{{propName}}" has wrong casing. Should be "{{correctVersion}}".',
        },
        schema: {
            type: 'array',
            items: [
                {
                    type: 'string',
                    enum: Object.keys(validCases),
                },
                {
                    type: 'object',
                    required: ['ignore'],
                    properties: {
                        ignore: {
                            type: 'array',
                            items: {
                                type: 'string',
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
        SchemaObject: ({node, report, setting, location}): void => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName, opts = {}] = setting;
            const IGNORE_PROPERTIES = new Set<string>(
                Array.isArray(opts.ignore) ? opts.ignore : [],
            );
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const validPropCases: Set<string> =
                    validCases[settingCasingName];
                if ('properties' in node && node.properties) {
                    Object.keys(node.properties).forEach(propName => {
                        if (IGNORE_PROPERTIES.has(propName)) return;
                        const propCase = Case.of(propName);
                        if (!validPropCases.has(propCase)) {
                            const correctVersion = Case[settingCasingName](
                                propName,
                            );

                            report({
                                messageId: 'casing',
                                data: {
                                    propName,
                                    correctVersion,
                                },
                                location: [...location, 'properties', propName],
                            });
                        }
                    });
                }
                return;
            }
        },
    },
    openapiVisitor: {
        SchemaObject: ({node, report, location, setting}): void => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName, opts = {}] = setting;
            const IGNORE_PROPERTIES = new Set<string>(
                Array.isArray(opts.ignore) ? opts.ignore : [],
            );
            if (
                !(
                    typeof settingCasingName === 'string' &&
                    isValidCaseName(settingCasingName)
                )
            )
                return;

            const validPropCases: Set<string> = validCases[settingCasingName];
            if (
                'properties' in node &&
                node.properties &&
                typeof node.properties === 'object'
            ) {
                Object.keys(node.properties).forEach(propName => {
                    if (IGNORE_PROPERTIES.has(propName)) return;
                    const propCase = Case.of(propName);
                    if (!validPropCases.has(propCase)) {
                        const correctVersion = Case[settingCasingName](
                            propName,
                        );

                        report({
                            messageId: 'casing',
                            data: {
                                propName,
                                correctVersion,
                            },
                            location: [...location, 'properties', propName],
                        });
                    }
                });
            }
        },
    },
    defaultSetting: ['camel'],
});

export default rule;
