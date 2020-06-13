import {SwaggerlintRule} from '../../types';

const name = 'expressive-path-summary';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        OperationObject: ({node, report, location}): void => {
            const {summary} = node;
            if (typeof summary === 'string') {
                if (summary.split(' ').length < 2) {
                    report(
                        `Every path summary should contain at least 2 words. This has "${summary}"`,
                        [...location, 'summary'],
                    );
                }
            } else {
                report('Every path has to have summary.');
            }
        },
    },
};

export default rule;
