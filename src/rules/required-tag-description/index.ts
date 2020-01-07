import {Rule} from '../../types';

const name = 'required-tag-description';

const rule: Rule = {
    name,
    visitor: {
        TagObject: ({node, report}) => {
            if (!('description' in node) || !node.description) {
                report(`Tag "${node.name}" is missing description.`);
            }
        },
    },
};

export default rule;
