import Case from 'case';
import {Rule} from '../../types';
import {isRef} from '../../utils';

const name = 'object-prop-casing';

const validCasesSets = {
    camel: new Set(['camel', 'lower']), // someName
    snake: new Set(['snake', 'lower']), // some_name
    pascal: new Set(['pascal']), // SomeName
    constant: new Set(['constant']), // SOME_NAME
};

function isValidRuleOption(name: string): name is keyof typeof validCasesSets {
    return name in validCasesSets;
}

const rule: Rule = {
    name,
    visitor: {
        SchemaObject: ({node, report, setting}) => {
            const settingCasingName = setting[0];
            if (
                typeof settingCasingName === 'string' &&
                isValidRuleOption(settingCasingName)
            ) {
                const validCases = validCasesSets[settingCasingName];
                if (isRef(node)) return;
                if (node.type !== 'object') return;
                if ('properties' in node && node.properties) {
                    Object.keys(node.properties).forEach(propName => {
                        const propCase = Case.of(propName);
                        if (!validCases.has(propCase)) {
                            report(`Property "${propName}" has wrong casing.`);
                        }
                    });
                }
                return;
            }
            report(`${settingCasingName} is not a valid plugin option.`);
        },
    },
    isValidSetting: option => !!option[0] && option[0] in validCasesSets,
};

export default rule;
