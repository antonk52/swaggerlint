import {Rule} from '../../types';

const name = 'no-trailing-slash';

const rule: Rule = {
    name,
    visitor: {
        PathsObject: ({node, report}) => {
            const urls = Object.keys(node);

            urls.forEach(url => {
                if (url.endsWith('/')) {
                    report(`url cannot end with a slash "${url}".`);
                }
            });
        },
        SwaggerObject: ({node, report}) => {
            const {host} = node;

            if (typeof host === 'string' && host.endsWith('/')) {
                report('Host url cannot end with a slash.');
            }
        },
    },
};

export default rule;
