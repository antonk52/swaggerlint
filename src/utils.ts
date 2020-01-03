import path from 'path';
import fetch from 'node-fetch';
import yaml from 'js-yaml';
import {cosmiconfigSync} from 'cosmiconfig';
const pkg = require('../package.json');

import {
    Config,
    SwaggerObject,
    LintError,
    ReferenceObject,
    SchemaObjectAllOfObject,
    VisitorName,
} from './types';

const isDev = process.env.NODE_ENV === 'development';

export const log = isDev ? (x: string) => console.log(`--> ${x}`) : () => null;

export function isYamlPath(p: string) {
    const ext = path.extname(p);

    return ext === '.yml' || ext === '.yaml';
}

export async function fetchUrl(url: string): Promise<SwaggerObject> {
    return fetch(url).then(x =>
        isYamlPath(url) ? x.text().then(yaml.safeLoad) : x.json(),
    );
}

export function getConfig(configPath?: string): Config | null {
    return typeof configPath === 'string'
        ? cosmiconfigSync(pkg.name).load(configPath)?.config
        : cosmiconfigSync(pkg.name).search()?.config;
}

function toOneLinerFormat({msg, name, location}: LintError) {
    const locationInfo =
        location.length > 0 ? `\n  in ${location.join('.')}` : '';
    return `-> ${name}${locationInfo}\n  ${msg}`;
}

export function logErrors(errors: LintError[]): void {
    console.log(errors.map(toOneLinerFormat).join('\n'));
    console.log(`\n\nYou have ${errors.length} errors.`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRef(arg: Record<string, any>): arg is ReferenceObject {
    return typeof arg.$ref === 'string';
}

export function isSchemaObjectAllOfObject(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arg: Record<string, any>,
): arg is SchemaObjectAllOfObject {
    return Array.isArray(arg.allOf);
}

const visitorSet = new Set([
    'SwaggerObject',
    'InfoObject',
    'PathsObject',
    'DefinitionsObject',
    'ParametersDefinitionsObject',
    'ResponsesDefinitionsObject',
    'SecurityDefinitionsObject',
    'SecuritySchemeObject',
    'ScopesObject',
    'SecurityRequirementObject',
    'TagObject',
    'ExternalDocumentationObject',
    'ContactObject',
    'LicenseObject',
    'PathItemObject',
    'OperationObject',
    'ParameterObject',
    'ResponsesObject',
    'ResponseObject',
    'SchemaObject',
    'XMLObject',
    'HeadersObject',
    'HeaderObject',
    'ItemsObject',
    'ExampleObject',
]);
export function isValidVisitorName(name: string): name is VisitorName {
    return visitorSet.has(name);
}
