import {SwaggerlintRule} from '../../types';

const name = 'expressive-path-summary';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        OperationObject: ({node, report}): void => {
            const {summary} = node;
            if (summary) {
                if (summary.split(' ').length < 2) {
                    report(
                        `Every path summary should contain at least 2 words. This has "${summary}"`,
                    );
                }
            } else {
                report('Every path has to have summary.');
            }
        },
    },
};

export default rule;
