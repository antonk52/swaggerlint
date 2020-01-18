import Case from 'case';
import {Rule} from '../../types';
import {isRef, validCases, isValidCaseName, isObject} from '../../utils';

const name = 'object-prop-casing';

const rule: Rule = {
    name,
    visitor: {
        SchemaObject: ({node, report, setting, location}) => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName, opts = {}] = setting;
            const IGNORE_PROPERTIES = new Set<string>(opts.ignore ?? []);
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const validPropCases = validCases[settingCasingName];
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
                                [...location, 'properties'],
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
            const isIgnoreAnArray =
                'ignore' in second && Array.isArray(second.ignore);
            if (!isIgnoreAnArray) return false;

            const isEachIgnoreItemString = second.ignore.every(
                (x: unknown) => typeof x === 'string',
            );
            if (!isEachIgnoreItemString) {
                return {msg: 'Each item in "ignore" has to be a string.'};
            }

            return true;
        } else return false;
    },
};

export default rule;
