import Case from 'case';
import {SwaggerlintRule} from '../../types';
import {validCases, isValidCaseName, isObject} from '../../utils';
import {isRef} from '../../utils/swagger';

const name = 'object-prop-casing';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        SchemaObject: ({node, report, setting, location}): void => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName, opts = {}] = setting;
            const IGNORE_PROPERTIES = new Set<string>(
                Array.isArray(opts.ignore) ? opts.ignore : [],
            );
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const validPropCases: Set<string> =
                    validCases[settingCasingName];
                if (isRef(node)) return;
                if ('properties' in node && node.properties) {
                    Object.keys(node.properties).forEach(propName => {
                        if (IGNORE_PROPERTIES.has(propName)) return;
                        const propCase = Case.of(propName);
                        if (!validPropCases.has(propCase)) {
                            const correctVersion =
                                settingCasingName in validCases
                                    ? Case[settingCasingName](propName)
                                    : '';

                            report(
                                `Property "${propName}" has wrong casing.${
                                    correctVersion
                                        ? ` Should be "${correctVersion}".`
                                        : ''
                                }`,
                                [...location, 'properties', propName],
                            );
                        }
                    });
                }
                return;
            }
        },
    },
    isValidSetting: option => {
        if (typeof option !== 'object') return false;

        const [first, second] = option;
        const isValidFirstItem = first in validCases;
        if (!isValidFirstItem) return false;
        if (option.length === 1) return true;

        if (isObject(second)) {
            const {ignore} = second;
            if (!Array.isArray(ignore)) return false;

            const isEachIgnoreItemString = ignore.every(
                (x: unknown) => typeof x === 'string',
            );
            if (!isEachIgnoreItemString) {
                return {msg: 'Each item in "ignore" has to be a string.'};
            }

            return true;
        } else return false;
    },
    defaultSetting: ['camel'],
};

export default rule;
