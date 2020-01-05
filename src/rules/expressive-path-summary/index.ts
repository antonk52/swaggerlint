import {Rule} from '../../types';

const name = 'expressive-path-summary';

const rule: Rule = {
    name,
    visitor: {
        OperationObject: ({node, report}) => {
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
