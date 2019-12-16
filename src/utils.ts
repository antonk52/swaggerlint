import fetch from 'node-fetch';

import {OpenAPIObject, LintError} from './types';

const isDev = process.env.NODE_ENV === 'development';

export const log = isDev ? (x: any) => console.log(`--> ${x}`) : () => {};

export async function fetchUrl(url: string): Promise<OpenAPIObject> {
    return fetch(url).then(x => x.json());
}

function toOneLinerFormat({msg, name}: LintError) {
    return `-> ${name}\n${msg}`;
}

export function logErrors(errors: LintError[]): void {
    console.log(errors.map(toOneLinerFormat).join('\n'));
    console.log(`\n\nYou have ${errors.length} errors.`);
}
