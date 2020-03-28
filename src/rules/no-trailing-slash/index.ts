import {SwaggerlintRule} from '../../types';

const name = 'no-trailing-slash';

const rule: SwaggerlintRule = {
    name,
    visitor: {
        PathsObject: ({node, report}): void => {
            const urls = Object.keys(node);

            urls.forEach(url => {
                if (url.endsWith('/')) {
                    report(`Url cannot end with a slash "${url}".`);
                }
            });
        },
        SwaggerObject: ({node, report}): void => {
            const {host} = node;

            if (typeof host === 'string' && host.endsWith('/')) {
                report('Host url cannot end with a slash.');
            }
        },
    },
};

export default rule;
