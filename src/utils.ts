import path from 'path';
import fetch from 'node-fetch';
import yaml from 'js-yaml';

import {SwaggerObject, LintError, ReferenceObject} from './types';

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

function toOneLinerFormat({msg, name}: LintError) {
    return `-> ${name}\n${msg}`;
}

export function logErrors(errors: LintError[]): void {
    console.log(errors.map(toOneLinerFormat).join('\n'));
    console.log(`\n\nYou have ${errors.length} errors.`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRef(arg: Record<string, any>): arg is ReferenceObject {
    return typeof arg.$ref === 'string';
}
