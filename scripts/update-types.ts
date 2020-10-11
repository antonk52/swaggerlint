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

async function makeTypesFor(target: 'swagger' | 'openapi') {
    const {nameSpace, predicates} = {
        swagger: {
            nameSpace: 'Swagger',
            predicates: swaggerTypeToVisitorPredicate,
        },
        openapi: {
            nameSpace: 'OpenAPI',
            predicates: openapiTypeToVisitorPredicate,
        },
    }[target];

    const typesContent = await fs.readFile(paths[target]);
    const typeNames = typesContent
        .toString()
        .split('\n')
        .filter(line => line.startsWith('export type '))
        .map(line => line.match(/export type (\w+).*/)?.[1])
        .filter(isString)
        .sort();

    const visitorsLines = [
        `export type ${nameSpace}Visitors = {`,
        ...typeNames.map(name => {
            const foundPredicate = predicates.find(x => x[0].includes(name));

            return foundPredicate?.[1](name) ?? manyVisitors(nameSpace)(name);
        }),
        '};',
        '',
        `export type ${nameSpace}VisitorName = keyof ${nameSpace}RuleVisitor<''>;`,
    ];

    const typesLines = [
        `export type ${nameSpace}Types = {`,
        ...typeNames.map(name => `${name}: ${nameSpace}.${name};`),
        '};',
    ];

    const ruleVisitorLines = [
        `export type ${nameSpace}RuleVisitor<M extends string> = Partial<{`,
        ...typeNames.map(
            name => `${name}: RuleVisitorFunction<${nameSpace}.${name}, M>;`,
        ),
        '}>;',
    ];

    const lines = [
        ...visitorsLines,
        '',
        ...typesLines,
        '',
        ...ruleVisitorLines,
    ];

    await mmac({
        id: target,
        filepath: paths.swaggerlint,
        updateScript: 'npm run update-types',
        lines,
        transform: x => format(x, {parser: 'typescript', ...prettierConfig}),
    });
}

async function updateTypes() {
    await makeTypesFor('swagger');
    await makeTypesFor('openapi');

    console.log('✅types are updated');
}

updateTypes().catch(e => {
    console.error(e);
    process.exit(1);
});
