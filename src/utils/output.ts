import {LintError, SwaggerObject} from '../types';
import _get from 'lodash.get';
import {bold, red, dim, grey} from 'kleur';

const PAD = 6;

function shallowStringify(swagger: SwaggerObject, location: string[]): string {
    let topLevelObject = true;
    const objToStringify = _get(swagger, location);
    const stringifiedObj = JSON.stringify(
        objToStringify,
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
    swagger: SwaggerObject | void,
) {
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

export function logErrors(
    errors: LintError[],
    swagger: SwaggerObject | void,
): void {
    console.log(errors.map(x => toOneLinerFormat(x, swagger)).join('\n'));
    console.log('\n');
    const hasErrs = !!errors.length;
    console.log(bold(`You have ${errors.length} error${hasErrs ? 's' : ''}.`));
}
