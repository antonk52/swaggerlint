import {Rule} from '../../types';

const name = 'required-operation-tags';

const rule: Rule = {
    name,
    visitor: {
        OperationObject: ({node, report, location}) => {
            if (!Array.isArray(node.tags) || node.tags.length < 1) {
                const method = location[location.length - 1];
                const url = location[location.length - 2];
                report(`Operation "${method}" in "${url}" is missing tags.`);
            }
        },
    },
};

export default rule;
