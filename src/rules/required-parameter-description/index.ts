import {SwaggerlintRule} from '../../types';

const name = 'required-parameter-description';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        ParameterObject: ({node, report, location}): void => {
            if (!('description' in node)) {
                report(`"${node.name}" parameter is missing description.`);
                return;
            }
            if (typeof node.description === 'string' && !node.description) {
                report(`"${node.name}" parameter is missing description.`, [
                    ...location,
                    'description',
                ]);
            }
        },
    },
};

export default rule;
