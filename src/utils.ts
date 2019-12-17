import path from 'path';
import fetch from 'node-fetch';
import yaml from 'js-yaml';

import {OpenAPIObject, LintError} from './types';

const isDev = process.env.NODE_ENV === 'development';

export const log = isDev ? (x: any) => console.log(`--> ${x}`) : () => {};

export function isYamlPath(p: string) {
    const ext = path.extname(p);

    return ext === '.yml' || ext === '.yaml';
}

export async function fetchUrl(url: string): Promise<OpenAPIObject> {
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
