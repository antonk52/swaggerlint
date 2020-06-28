import {SwaggerlintRule} from '../../types';

const name = 'required-tag-description';

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        TagObject: ({node, report}): void => {
            if (!('description' in node) || !node.description) {
                report(`Tag "${node.name}" is missing description.`);
            }
        },
    },
};

export default rule;
