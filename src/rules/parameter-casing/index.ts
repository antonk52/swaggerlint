import Case from 'case';
import {SwaggerlintRule, ParameterObject, CaseName} from '../../types';
import {validCases, isValidCaseName, isObject, hasKey} from '../../utils';

const name = 'parameter-casing';

function getCasesSetFromOptions(
    option: unknown,
    defaultCase: Set<string>,
): Set<string> {
    return typeof option === 'string' && isValidCaseName(option)
        ? validCases[option]
        : defaultCase;
}

const PARAMETER_LOCATIONS: ParameterObject['in'][] = [
    'query',
    'header',
    'path',
    'formData',
    'body',
];

const rule: SwaggerlintRule = {
    name,
    visitor: {
        ParameterObject: ({node, report, setting}): void => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName, opts = {}] = setting;
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const defaultParamCase = validCases[settingCasingName];
                const cases = {
                    query: getCasesSetFromOptions(opts.query, defaultParamCase),
                    header: getCasesSetFromOptions(
                        opts.header,
                        defaultParamCase,
                    ),
                    path: getCasesSetFromOptions(opts.path, defaultParamCase),
                    formData: getCasesSetFromOptions(
                        opts.formData,
                        defaultParamCase,
                    ),
                    body: getCasesSetFromOptions(opts.body, defaultParamCase),
                };

                const IGNORE_PARAMETER_NAMES = new Set<string>(
                    Array.isArray(opts.ignore) ? opts.ignore : [],
                );

                if (IGNORE_PARAMETER_NAMES.has(node.name)) return;

                const nodeCase = Case.of(node.name);
                const paramLocation = node.in;
                if (!cases[paramLocation].has(nodeCase)) {
                    const shouldBeCase: CaseName = cases[paramLocation]
                        .values()
                        .next().value;
                    if (
                        isValidCaseName(shouldBeCase) &&
                        !(shouldBeCase in Case)
                    ) {
                        return;
                    }

                    const correctVersion =
                        settingCasingName in validCases
                            ? Case[shouldBeCase](node.name)
                            : '';

                    report(
                        `Parameter "${node.name}" has wrong casing.${
                            correctVersion
                                ? ` Should be "${correctVersion}".`
                                : ''
                        }`,
                    );
                }
            }
        },
    },
    isValidSetting: option => {
        if (typeof option !== 'object') return false;

        const [first, second] = option;
        const isValidFirstItem = first in validCases;
        if (!isValidFirstItem) {
            return {msg: `"${first}" is not a valid rule setting`};
        }
        if (option.length === 1) return true;

        if (isObject(second)) {
            if (hasKey('ignore', second)) {
                const {ignore} = second;
                if (!Array.isArray(ignore))
                    return {
                        msg: 'Setting contains "ignore" which is not an array.',
                    };

                const isEachIgnoreItemString = ignore.every(
                    (x: unknown) => typeof x === 'string',
                );
                if (!isEachIgnoreItemString) {
                    return {msg: 'Each item in "ignore" has to be a string.'};
                }
            }

            if (PARAMETER_LOCATIONS.some(name => !isValidCaseName(name))) {
                return {
                    msg:
                        'Settings for parameter location has to be a valid case name.',
                };
            }

            return true;
        } else return false;
    },
    defaultSetting: ['camel', {header: 'kebab'}],
};

export default rule;
