import Case from 'case';
import {Rule} from '../../types';
import {isRef, validCases, isValidCaseName} from '../../utils';

const name = 'object-prop-casing';

const rule: Rule = {
    name,
    visitor: {
        SchemaObject: ({node, report, setting, location}) => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName] = setting;
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const validPropCases = validCases[settingCasingName];
                if (isRef(node)) return;
                if ('properties' in node && node.properties) {
                    Object.keys(node.properties).forEach(propName => {
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
    isValidSetting: option =>
        Array.isArray(option) && !!option[0] && isValidCaseName(option[0]),
};

export default rule;
