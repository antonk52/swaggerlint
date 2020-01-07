import Case from 'case';
import {Rule} from '../../types';
import {validCases, isValidCaseName} from '../../utils';

const name = 'parameter-casing';

const rule: Rule = {
    name,
    visitor: {
        ParameterObject: ({node, report, setting}) => {
            if (typeof setting === 'boolean') return;

            const [settingCasingName] = setting;
            if (
                typeof settingCasingName === 'string' &&
                isValidCaseName(settingCasingName)
            ) {
                const validParamCase = validCases[settingCasingName];
                const nodeCase = Case.of(node.name);
                if (!validParamCase.has(nodeCase)) {
                    const correctVersion =
                        settingCasingName in validCases
                            ? Case[settingCasingName](node.name)
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
    isValidSetting: option =>
        Array.isArray(option) && !!option[0] && isValidCaseName(option[0]),
};

export default rule;
