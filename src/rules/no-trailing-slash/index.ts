import {createRule} from '../../utils';

const name = 'no-trailing-slash';

const rule = createRule({
    name,
    docs: {
        recommended: true,
        description: 'URLs must NOT end with a slash',
    },
    meta: {
        messages: {
            url: 'Url cannot end with a slash "{{url}}".',
            host: 'Host cannot end with a slash, your host url is "{{url}}".',
            server: 'Server url cannot end with a slash "{{url}}".',
        },
    },
    swaggerVisitor: {
        PathsObject: ({node, report, location}): void => {
            const urls = Object.keys(node);

            urls.forEach(url => {
                if (url.endsWith('/')) {
                    report({
                        messageId: 'url',
                        data: {
                            url,
                        },
                        location: [...location, url],
                    });
                }
            });
        },
        SwaggerObject: ({node, report}): void => {
            const {host} = node;

            if (typeof host === 'string' && host.endsWith('/')) {
                report({
                    messageId: 'host',
                    data: {url: host},
                    location: ['host'],
                });
            }
        },
    },
    openapiVisitor: {
        PathItemObject: ({report, location}): void => {
            const url = location[location.length - 1];

            if (url.endsWith('/')) {
                report({
                    messageId: 'url',
                    data: {
                        url,
                    },
                });
            }
        },
        ServerObject: ({node, report, location}): void => {
            if (node.url.endsWith('/')) {
                report({
                    messageId: 'server',
                    data: {url: node.url},
                    location: [...location, 'url'],
                });
            }
        },
    },
});

export default rule;
