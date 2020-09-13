import type {JSONSchema4} from 'json-schema';
import Case from 'case';
import {CaseName, Swagger, OpenAPI} from '../../types';
import {createRule, isValidCaseName, validCases} from '../../utils';

const name = 'parameter-casing';

function getCasesSetFromOptions(
    option: unknown,
    defaultCase: Set<string>,
): Set<string> {
    return typeof option === 'string' && isValidCaseName(option)
        ? validCases[option]
        : defaultCase;
}

const PARAMETER_LOCATIONS: (
    | Swagger.ParameterObject['in']
    | OpenAPI.ParameterObject['in']
)[] = [
    'query',
    'header',
    'path',
    'cookie', // OpenAPI specific
    'formData', // Swagger specific
    'body',
];

const validCasesArr = Object.keys(validCases);

const paramsSchema = PARAMETER_LOCATIONS.reduce((acc, el) => {
    acc[el] = {
        type: 'string',
        enum: validCasesArr,
    };
    return acc;
}, {} as Record<string, JSONSchema4>);

const rule = createRule({
    name,
    meta: {
        messages: {
            casing:
                'Parameter "{{name}}" has wrong casing. Should be "{{correctVersion}}".',
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
                    properties: {
                        ...paramsSchema,
                        ignore: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                    additionalProperties: false,
                },
            ],
            minItems: 1,
            maxItems: 2,
        },
    },
    swaggerVisitor: {
        ParameterObject: ({node, report, location, setting}): void => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName, opts = {}] = setting;
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const defaultParamCase = validCases[settingCasingName];
                const cases = {
                    query: getCasesSetFromOptions(opts.query, defaultParamCase),
                    header: getCasesSetFromOptions(
                        opts.header,
                        defaultParamCase,
                    ),
                    path: getCasesSetFromOptions(opts.path, defaultParamCase),
                    formData: getCasesSetFromOptions(
                        opts.formData,
                        defaultParamCase,
                    ),
                    body: getCasesSetFromOptions(opts.body, defaultParamCase),
                };

                const IGNORE_PARAMETER_NAMES = new Set<string>(
                    Array.isArray(opts.ignore) ? opts.ignore : [],
                );

                if (IGNORE_PARAMETER_NAMES.has(node.name)) return;

                const nodeCase = Case.of(node.name);
                const paramLocation = node.in;
                if (!cases[paramLocation].has(nodeCase)) {
                    const shouldBeCase: CaseName = cases[paramLocation]
                        .values()
                        .next().value;

                    const correctVersion = Case[shouldBeCase](node.name);

                    report({
                        messageId: 'casing',
                        data: {
                            name: node.name,
                            correctVersion,
                        },
                        location: [...location, 'name'],
                    });
                }
            }
        },
    },
    openapiVisitor: {
        ParameterObject: ({node, report, location, setting}): void => {
            if (typeof setting === 'boolean') return;
            const [settingCasingName, opts = {}] = setting;
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const defaultParamCase = validCases[settingCasingName];
                const cases = {
                    query: getCasesSetFromOptions(opts.query, defaultParamCase),
                    header: getCasesSetFromOptions(
                        opts.header,
                        defaultParamCase,
                    ),
                    path: getCasesSetFromOptions(opts.path, defaultParamCase),
                    cookie: getCasesSetFromOptions(
                        opts.cookie,
                        defaultParamCase,
                    ),
                };

                const IGNORE_PARAMETER_NAMES = new Set<string>(
                    Array.isArray(opts.ignore) ? opts.ignore : [],
                );

                if (IGNORE_PARAMETER_NAMES.has(node.name)) return;

                const nodeCase = Case.of(node.name);
                const paramLocation = node.in;
                if (!cases[paramLocation].has(nodeCase)) {
                    const shouldBeCase: CaseName = cases[paramLocation]
                        .values()
                        .next().value;

                    const correctVersion = Case[shouldBeCase](node.name);

                    report({
                        messageId: 'casing',
                        data: {
                            name: node.name,
                            correctVersion,
                        },
                        location: [...location, 'name'],
                    });
                }
            }
        },
    },
    defaultSetting: ['camel', {header: 'kebab'}],
});

export default rule;
