import {SwaggerlintRule} from '../../types';

const name = 'no-trailing-slash';

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        PathsObject: ({node, report, location}): void => {
            const urls = Object.keys(node);

            urls.forEach(url => {
                if (url.endsWith('/')) {
                    report(`Url cannot end with a slash "${url}".`, [
                        ...location,
                        url,
                    ]);
                }
            });
        },
        SwaggerObject: ({node, report}): void => {
            const {host} = node;

            if (typeof host === 'string' && host.endsWith('/')) {
                report('Host url cannot end with a slash.', ['host']);
            }
        },
    },
    openapiVisitor: {
        PathItemObject: ({report, location}): void => {
            const url = location[location.length - 1];

            if (url.endsWith('/')) {
                report(`Url cannot end with a slash "${url}".`);
            }
        },
        ServerObject: ({node, report, location}): void => {
            if (node.url.endsWith('/')) {
                report('Server url cannot end with a slash.', [
                    ...location,
                    'url',
                ]);
            }
        },
    },
};

export default rule;
