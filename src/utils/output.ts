import {LintError, Swagger, OpenAPI} from '../types';
import {bold, red, dim, grey} from 'kleur';

const PAD = 6;

function shallowStringify(
    schema: Swagger.SwaggerObject | OpenAPI.OpenAPIObject,
    location: string[],
): string {
    let topLevelObject = true;
    const target = location.reduce(
        // @ts-expect-error
        (acc, key) => acc?.[key],
        schema,
    );
    const stringifiedObj = JSON.stringify(
        target,
        (_, value) => {
            if (Array.isArray(value)) {
                return `Array(${value.length})`;
            }
            if (typeof value === 'object' && value !== null) {
                return topLevelObject
                    ? ((topLevelObject = false), value)
                    : 'Object';
            }
            return value;
        },
        PAD + 2,
    );

    return grey(
        (stringifiedObj || '')
            .split('\n')
            .map((x: string) => x.padStart(PAD + 1, ' '))
            .join('\n'),
    );
}

function toOneLinerFormat(
    {msg, name, location}: LintError,
    swagger: Swagger.SwaggerObject | OpenAPI.OpenAPIObject | void,
): string {
    const hasLocation = location.length;
    const locationInfo = hasLocation ? ` in ${location.join('.')}` : '';
    const ruleName = dim(name);

    return [
        `${red('error')}${locationInfo}`,
        ruleName.padStart(ruleName.length + PAD, ' '),
        msg.padStart(msg.length + PAD, ' '),
        hasLocation && swagger && shallowStringify(swagger, location),
    ]
        .filter(Boolean)
        .join('\n');
}

export function logErrorCount(count: number): void {
    console.log(bold(`You have ${count} error${!!count ? 's' : ''}.`));
}

type LogErrorsOptions = Partial<{
    filename: string;
    count: boolean;
}>;

export function logErrors(
    errors: LintError[],
    schema: Swagger.SwaggerObject | OpenAPI.OpenAPIObject | void,
    options: LogErrorsOptions = {},
): void {
    if (options.filename) console.log(`\n${bold(options.filename)}`);

    console.log(errors.map(x => toOneLinerFormat(x, schema)).join('\n'));

    if (options.count) logErrorCount(errors.length);
}
