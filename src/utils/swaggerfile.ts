import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import fetch from 'node-fetch';
import {SwaggerObject} from '../types';

function isYamlPath(p: string): boolean {
    const ext = path.extname(p);

    return ext === '.yml' || ext === '.yaml';
}

type ResultSuccess = {
    swagger: SwaggerObject;
};
type ResultFail = {
    swagger: null;
    error: string;
};

type Result = ResultSuccess | ResultFail;

export function getSwaggerByPath(pth: string): Result {
    const swaggerPath = path.resolve(pth);
    // non existing path
    if (!fs.existsSync(swaggerPath)) {
        return {
            error: 'File at the provided path does not exist.',
            swagger: null,
        };
    }

    const isYaml = isYamlPath(swaggerPath);

    try {
        const swagger: SwaggerObject = isYaml
            ? yaml.safeLoad(fs.readFileSync(swaggerPath, 'utf8'))
            : require(swaggerPath);

        return {
            swagger,
        };
    } catch (e) {
        return {
            swagger: null,
            error: 'Error requiring swaggerlint config',
        };
    }
}

export async function getSwaggerByUrl(url: string): Promise<SwaggerObject> {
    return fetch(url).then(x =>
        isYamlPath(url) ? x.text().then(yaml.safeLoad) : x.json(),
    );
}
