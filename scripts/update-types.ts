import {promises as fs} from 'fs';
import * as path from 'path';
import {mmac} from 'make-me-a-content';
import {format, Options} from 'prettier';

const prettierConfig = require('../prettier.config') as Options;

const typesDir = path.join(__dirname, '..', 'src', 'types');
const paths = {
    swaggerlint: path.join(typesDir, 'swaggerlint.ts'),
    openapi: path.join(typesDir, 'openapi.ts'),
    swagger: path.join(typesDir, 'swagger.ts'),
};

const alwaysOneVisitor = (_namespace: string) => (name: string) =>
    `${name}: [NodeWithLocation<${_namespace}.${name}>];`;
const oneOrNoVisitors = (_namespace: string) => (name: string) =>
    `${name}: [NodeWithLocation<${_namespace}.${name}>] | [];`;
const manyVisitors = (_namespace: string) => (name: string) =>
    `${name}: NodeWithLocation<${_namespace}.${name}>[];`;

const openapiTypeToVisitorPredicate: [string[], (arg: string) => string][] = [
    [
        ['InfoObject', 'OpenAPIObject', 'PathsObject'],
        alwaysOneVisitor('OpenAPI'),
    ],
    [
        // prettier
        ['ComponentsObject'],
        oneOrNoVisitors('OpenAPI'),
    ],
];

const swaggerTypeToVisitorPredicate: [string[], (arg: string) => string][] = [
    [
        ['InfoObject', 'SwaggerObject', 'PathsObject'],
        alwaysOneVisitor('Swagger'),
    ],
    [
        // prettier
        [
            'DefinitionsObject',
            'ParametersDefinitionsObject',
            'ResponsesDefinitionsObject',
            'SecurityDefinitionsObject',
            'ContactObject',
            'LicenseObject',
        ],
        oneOrNoVisitors('Swagger'),
    ],
];

function isString(arg: unknown): arg is string {
    return typeof arg === 'string';
}

async function updateTypes() {
    const openapiTypesContent = await fs.readFile(paths.openapi);
    const openapiTypeNames = openapiTypesContent
        .toString()
        .split('\n')
        .filter(line => line.startsWith('export type '))
        .map(line => line.match(/export type (\w+).*/)?.[1])
        .filter(isString)
        .sort();

    const openapiVisitorsLines = [
        'export type OpenAPIVisitors = {',
        ...openapiTypeNames.map(name => {
            const foundPredicate = openapiTypeToVisitorPredicate.find(x =>
                x[0].includes(name),
            );

            return foundPredicate?.[1](name) ?? manyVisitors('OpenAPI')(name);
        }),
        '};',
        '',
        "export type OpenAPIVisitorName = keyof OpenAPIRuleVisitor<''>;",
    ];

    const openapiTypesLines = [
        'export type OpenAPITypes = {',
        ...openapiTypeNames.map(name => `${name}: OpenAPI.${name};`),
        '};',
    ];

    const openapiRuleVisitorLines = [
        'export type OpenAPIRuleVisitor<M extends string> = Partial<{',
        ...openapiTypeNames.map(
            name => `${name}: RuleVisitorFunction<OpenAPI.${name}, M>;`,
        ),
        '}>;',
    ];

    const lines = [
        ...openapiVisitorsLines,
        '',
        ...openapiTypesLines,
        '',
        ...openapiRuleVisitorLines,
    ];

    await mmac({
        id: 'openapi',
        filepath: paths.swaggerlint,
        updateScript: 'npm run update-types',
        comments: {}, // TODO: remove from mmac
        lines,
        transform: x => format(x, {parser: 'typescript', ...prettierConfig}),
    });

    // =============== SWAGGER =================

    const swaggerTypesContent = await fs.readFile(paths.swagger);
    const swaggerTypeNames = swaggerTypesContent
        .toString()
        .split('\n')
        .filter(line => line.startsWith('export type '))
        .map(line => line.match(/export type (\w+).*/)?.[1])
        .filter(isString)
        .sort();

    const swaggerVisitorsLines = [
        'export type SwaggerVisitors = {',
        ...swaggerTypeNames.map(name => {
            const foundPredicate = swaggerTypeToVisitorPredicate.find(x =>
                x[0].includes(name),
            );

            return foundPredicate?.[1](name) ?? manyVisitors('Swagger')(name);
        }),
        '};',
        '',
        "export type SwaggerVisitorName = keyof SwaggerRuleVisitor<''>;",
    ];

    const swaggerTypesLines = [
        'export type SwaggerTypes = {',
        ...swaggerTypeNames.map(name => `${name}: Swagger.${name};`),
        '};',
    ];

    const swaggerRuleVisitorLines = [
        'export type SwaggerRuleVisitor<M extends string> = Partial<{',
        ...swaggerTypeNames.map(
            name => `${name}: RuleVisitorFunction<Swagger.${name}, M>;`,
        ),
        '}>;',
    ];

    const swaggerlines = [
        ...swaggerVisitorsLines,
        '',
        ...swaggerTypesLines,
        '',
        ...swaggerRuleVisitorLines,
    ];

    await mmac({
        id: 'swagger',
        filepath: paths.swaggerlint,
        updateScript: 'npm run update-types',
        comments: {}, // TODO: remove from mmac
        lines: swaggerlines,
        transform: x => format(x, {parser: 'typescript', ...prettierConfig}),
    });

    console.log('✅types are updated');
}

updateTypes().catch(console.error);
