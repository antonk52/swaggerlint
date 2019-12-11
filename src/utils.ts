import fetch from 'node-fetch';

import {Swagger, LintError} from './types';

const isDev = process.env.NODE_ENV === 'development';

export const log = isDev ? (x: any) => console.log(`--> ${x}`) : () => {};

export async function fetchUrl(url: string): Promise<Swagger> {
    return fetch(url).then(x => x.json());
}

export function logErrors(errors: LintError[]): void {
    console.log(errors.map(({msg, name}) => `\n-> ${name}\n${msg}`).join('\n'));
    console.log(`\n\nYou have ${errors.length} errors.`);
}
