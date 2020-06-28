import {OpenAPI, OpenAPIVisitors, LintError, ConfigIgnore} from './types';
import * as oaUtils from './utils/openapi';
// import * as utils from './utils/common';

type WalkerResult =
    | {
          visitors: OpenAPIVisitors;
      }
    | {
          errors: LintError[];
      };

export function walkOpenApi(
    schema: OpenAPI.OpenAPIObject,
    // TODO: support ignore param
    // eslint-disable-next-line
    _: ConfigIgnore = {},
): WalkerResult {
    console.log('walkOpenApi start');
    /* eslint-disable indent */
    const visitors: OpenAPIVisitors = {
        OpenAPIObject: [{node: schema, location: []}],
        InfoObject: [{node: schema.info, location: ['info']}],
        PathsObject: [{node: schema.paths, location: ['paths']}],
        PathItemObject: [],
        OperationObject: [],
        ServerObject: [],
        ServerVariableObject: [],
        ComponentsObject: schema.components
            ? [{node: schema.components, location: ['components']}]
            : [],

        SchemaObject: [],
        ResponseObject: [],
        ParameterObject: [],
        MediaTypeObject: [],
        ExampleObject: [],
        EncodingObject: [],
        RequestBodyObject: [],
        HeaderObject: [],
        SecuritySchemeObject: [],
        LinkObject: [],
        CallbackObject: [],

        SecurityRequirementObject: schema.security
            ? schema.security.map((node, i) => ({
                  node,
                  location: ['security', String(i)],
              }))
            : [],
        TagObject: schema.tags
            ? schema.tags.map((node, i) => ({
                  node,
                  location: ['tags', String(i)],
              }))
            : [],
        ExternalDocumentationObject: schema.externalDocs
            ? [{node: schema.externalDocs, location: ['externalDocs']}]
            : [],

        ReferenceObject: [],
    };
    /* eslint-enable indent */

    function handleSchemaObject(
        SchemaObject: OpenAPI.SchemaObject,
        location: string[],
    ): void {
        // TODO explore schema object
    }

    function handleHeaderObject(
        HeaderObject: OpenAPI.HeaderObject,
        location: string[],
    ): void {
        visitors.HeaderObject.push({
            node: HeaderObject,
            location,
        });

        if ('schema' in HeaderObject) {
            const {schema} = HeaderObject;
            const schemaLoc = [...location, 'schema'];
            if (oaUtils.isRef(schema)) {
                visitors.ReferenceObject.push({
                    node: schema,
                    location: schemaLoc,
                });
            } else {
                handleSchemaObject(schema, schemaLoc);
            }
        }
        if ('examples' in HeaderObject && HeaderObject.examples) {
            const {examples} = HeaderObject;
            Object.keys(examples).forEach(exampleKey => {
                const ExampleObject = examples[exampleKey];
                const exampleLocation = [...location, 'examples', exampleKey];

                if (oaUtils.isRef(ExampleObject)) {
                    visitors.ReferenceObject.push({
                        node: ExampleObject,
                        location: exampleLocation,
                    });
                } else {
                    visitors.ExampleObject.push({
                        node: ExampleObject,
                        location: exampleLocation,
                    });
                }
            });
        }

        if ('content' in HeaderObject && HeaderObject.content) {
            const {content} = HeaderObject;
            Object.keys(content).forEach(contentKey => {
                const MediaTypeObject = content[contentKey];
                const mtoLocation = [...location, 'content', contentKey];
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                handleMediaTypeObject(MediaTypeObject, mtoLocation);
            });
        }
    }

    function handleMediaTypeObject(
        MediaTypeObject: OpenAPI.MediaTypeObject,
        location: string[],
    ): void {
        visitors.MediaTypeObject.push({
            node: MediaTypeObject,
            location,
        });

        if (MediaTypeObject.schema) {
            if (oaUtils.isRef(MediaTypeObject.schema)) {
                visitors.ReferenceObject.push({
                    node: MediaTypeObject.schema,
                    location: [...location, 'schema'],
                });
            } else {
                handleSchemaObject(MediaTypeObject.schema, [
                    ...location,
                    'schema',
                ]);
            }
        }

        const {examples} = MediaTypeObject;
        if (examples) {
            Object.keys(examples).forEach(key => {
                const example = examples[key];
                if (oaUtils.isRef(example)) {
                    visitors.ReferenceObject.push({
                        node: example,
                        location: [...location, 'examples', key],
                    });
                } else {
                    visitors.ExampleObject.push({
                        node: example,
                        location: [...location, 'examples', key],
                    });
                }
            });
        }

        const {encoding} = MediaTypeObject;
        if (encoding) {
            Object.keys(encoding).forEach(encodingKey => {
                const EncodingObject = encoding[encodingKey];
                const encodingLocation = [...location, 'encoding', encodingKey];
                visitors.EncodingObject.push({
                    node: EncodingObject,
                    location: encodingLocation,
                });

                const {headers} = EncodingObject;
                if (headers) {
                    Object.keys(headers).forEach(headerKey => {
                        const HeaderObject = headers[headerKey];
                        const headerLocation = [
                            ...encodingLocation,
                            'headers',
                            headerKey,
                        ];

                        if (oaUtils.isRef(HeaderObject)) {
                            visitors.ReferenceObject.push({
                                node: HeaderObject,
                                location: headerLocation,
                            });
                        } else {
                            handleHeaderObject(HeaderObject, headerLocation);
                        }
                    });
                }
            });
        }
    }

    function handleResponseObject(
        ResponseObject: OpenAPI.ResponseObject,
        location: string[],
    ): void {
        visitors.ResponseObject.push({
            node: ResponseObject,
            location,
        });

        const {headers} = ResponseObject;
        if (headers) {
            Object.keys(headers).forEach(headerName => {
                const MaybeHeaderObject = headers[headerName];
                const headerLocation = [...location, 'headers', headerName];

                if (oaUtils.isRef(MaybeHeaderObject)) {
                    visitors.ReferenceObject.push({
                        node: MaybeHeaderObject,
                        location: headerLocation,
                    });
                } else {
                    handleHeaderObject(MaybeHeaderObject, headerLocation);
                }
            });
        }

        const {content} = ResponseObject;
        if (content) {
            Object.keys(content).forEach(contentName => {
                const MediaTypeObject = content[contentName];
                const contentLocation = [...location, 'content', contentName];

                handleMediaTypeObject(MediaTypeObject, contentLocation);
            });
        }

        const {links} = ResponseObject;
        if (links) {
            Object.keys(links).forEach(headerName => {
                const MaybeLinkObject = links[headerName];
                const linkLocation = [...location, 'links', headerName];

                if (oaUtils.isRef(MaybeLinkObject)) {
                    visitors.ReferenceObject.push({
                        node: MaybeLinkObject,
                        location: linkLocation,
                    });
                } else {
                    visitors.LinkObject.push({
                        node: MaybeLinkObject,
                        location: linkLocation,
                    });
                }
            });
        }
    }

    function handleRequestBodyObject(
        RequestBodyObject: OpenAPI.RequestBodyObject,
        location: string[],
    ): void {
        visitors.RequestBodyObject.push({
            node: RequestBodyObject,
            location,
        });

        const {content} = RequestBodyObject;
        Object.keys(content).forEach(contentKey => {
            const MediaTypeObject = content[contentKey];
            visitors.MediaTypeObject.push({
                node: MediaTypeObject,
                location: [...location, 'content', contentKey],
            });
        });
    }

    function handleParameterObject(
        ParameterObject: OpenAPI.ParameterObject,
        location: string[],
    ): void {
        visitors.ParameterObject.push({
            node: ParameterObject,
            location,
        });

        // diff between simple and complex param
        if ('content' in ParameterObject) {
            const {content} = ParameterObject;
            Object.keys(content).forEach(key => {
                const MediaTypeObject = content[key];

                handleMediaTypeObject(MediaTypeObject, [
                    ...location,
                    'content',
                    key,
                ]);
            });
        } else {
            const {schema, examples} = ParameterObject;
            if (oaUtils.isRef(schema)) {
                visitors.ReferenceObject.push({
                    node: schema,
                    location: [...location, 'schema'],
                });
            } else {
                visitors.SchemaObject.push({
                    node: schema,
                    location: [...location, 'schema'],
                });
            }

            if (examples) {
                Object.keys(examples).forEach(key => {
                    const example = examples[key];

                    if (oaUtils.isRef(example)) {
                        visitors.ReferenceObject.push({
                            node: example,
                            location: [...location, 'examples', key],
                        });
                    } else {
                        visitors.ExampleObject.push({
                            node: example,
                            location: [...location, 'examples', key],
                        });
                    }
                });
            }
        }
    }

    function handleOperationObject(
        OperationObject: OpenAPI.OperationObject,
        location: string[],
    ): void {
        visitors.OperationObject.push({
            node: OperationObject,
            location,
        });

        if (OperationObject.externalDocs) {
            visitors.ExternalDocumentationObject.push({
                node: OperationObject.externalDocs,
                location: [...location, 'externalDocs'],
            });
        }

        if (OperationObject.parameters) {
            OperationObject.parameters.forEach((parameter, index) => {
                const paramLocation = [
                    ...location,
                    'parameters',
                    String(index),
                ];

                if (oaUtils.isRef(parameter)) {
                    visitors.ReferenceObject.push({
                        node: parameter,
                        location: paramLocation,
                    });
                } else {
                    handleParameterObject(parameter, paramLocation);
                }
            });
        }

        if (OperationObject.requestBody) {
            const reqBodyLocation = [...location, 'requestBody'];

            if (oaUtils.isRef(OperationObject.requestBody)) {
                visitors.ReferenceObject.push({
                    node: OperationObject.requestBody,
                    location: reqBodyLocation,
                });
            } else {
                handleRequestBodyObject(
                    OperationObject.requestBody,
                    reqBodyLocation,
                );
            }
        }

        // TODO responses
        // TODO callbacks
        // TODO security
        // TODO servers
    }

    Object.keys(schema.paths).forEach(pathUrl => {
        /**
         * handle specification extensions
         * @see https://swagger.io/specification/#specificationExtensions
         */
        if (pathUrl.startsWith('x-')) return;

        const node = schema.paths[pathUrl];

        if (oaUtils.isRef(node)) {
            return visitors.ReferenceObject.push({
                node,
                location: ['paths', pathUrl],
            });
        }

        visitors.PathItemObject.push({node, location: ['paths', pathUrl]});

        oaUtils.httpMethods.forEach(httpMethod => {
            const operationObj = node[httpMethod];
            if (operationObj === undefined) return;

            handleOperationObject(operationObj, ['paths', pathUrl, httpMethod]);
        });

        if (node.servers) {
            node.servers.forEach((server, i) => {
                visitors.ServerObject.push({
                    node: server,
                    location: ['paths', pathUrl, 'servers', String(i)],
                });

                const {variables} = server;

                if (variables) {
                    Object.keys(variables).forEach(key => {
                        const sVariable = variables[key];
                        visitors.ServerVariableObject.push({
                            node: sVariable,
                            location: [
                                'paths',
                                pathUrl,
                                'servers',
                                String(i),
                                'variables',
                                key,
                            ],
                        });
                    });
                }
            });
        }

        if (node.parameters) {
            node.parameters.forEach((param, i) => {
                if (oaUtils.isRef(param)) {
                    return visitors.ReferenceObject.push({
                        node: param,
                        location: ['paths', pathUrl, 'parameters', String(i)],
                    });
                }

                handleParameterObject(param, [
                    'paths',
                    pathUrl,
                    'parameters',
                    String(i),
                ]);
            });
        }
    });

    if (schema.components) {
        if (schema.components.schemas) {
            const {schemas} = schema.components;
            Object.keys(schemas).forEach(schemaName => {
                const SchemaObject = schemas[schemaName];
                const location = ['components', 'schemas', schemaName];
                if (oaUtils.isRef(SchemaObject)) {
                    visitors.ReferenceObject.push({
                        node: SchemaObject,
                        location,
                    });
                } else {
                    handleSchemaObject(SchemaObject, location);
                }
            });
        }

        if (schema.components.responses) {
            const {responses} = schema.components;
            Object.keys(responses).forEach(responseName => {
                const ResponseObject = responses[responseName];
                const location = ['components', 'responses', responseName];
                if (oaUtils.isRef(ResponseObject)) {
                    visitors.ReferenceObject.push({
                        node: ResponseObject,
                        location,
                    });
                } else {
                    handleResponseObject(ResponseObject, location);
                }
            });
        }

        if (schema.components.parameters) {
            const {parameters} = schema.components;
            Object.keys(parameters).forEach(paramName => {
                const ParameterObject = parameters[paramName];
                const location = ['components', 'parameters', paramName];
                if (oaUtils.isRef(ParameterObject)) {
                    visitors.ReferenceObject.push({
                        node: ParameterObject,
                        location,
                    });
                } else {
                    handleParameterObject(ParameterObject, location);
                }
            });
        }

        if (schema.components.examples) {
            const {examples} = schema.components;
            Object.keys(examples).forEach(exampleName => {
                const ExampleObject = examples[exampleName];
                const location = ['components', 'examples', exampleName];
                if (oaUtils.isRef(ExampleObject)) {
                    visitors.ReferenceObject.push({
                        node: ExampleObject,
                        location,
                    });
                } else {
                    visitors.ExampleObject.push({
                        node: ExampleObject,
                        location,
                    });
                }
            });
        }

        if (schema.components.requestBodies) {
            const {requestBodies} = schema.components;
            Object.keys(requestBodies).forEach(reqBodyName => {
                const RequestBodyObject = requestBodies[reqBodyName];
                const location = ['components', 'requestBodies', reqBodyName];
                if (oaUtils.isRef(RequestBodyObject)) {
                    visitors.ReferenceObject.push({
                        node: RequestBodyObject,
                        location,
                    });
                } else {
                    handleRequestBodyObject(RequestBodyObject, location);
                }
            });
        }

        if (schema.components.headers) {
            const {headers} = schema.components;
            Object.keys(headers).forEach(headerName => {
                const HeaderObject = headers[headerName];
                const location = ['components', 'headers', headerName];
                if (oaUtils.isRef(HeaderObject)) {
                    visitors.ReferenceObject.push({
                        node: HeaderObject,
                        location,
                    });
                } else {
                    handleHeaderObject(HeaderObject, location);
                }
            });
        }

        if (schema.components.securitySchemes) {
            const {securitySchemes} = schema.components;
            Object.keys(securitySchemes).forEach(ssName => {
                const SecuritySchemeObject = securitySchemes[ssName];
                const location = ['components', 'securitySchemes', ssName];
                if (oaUtils.isRef(SecuritySchemeObject)) {
                    visitors.ReferenceObject.push({
                        node: SecuritySchemeObject,
                        location,
                    });
                } else {
                    visitors.SecuritySchemeObject.push({
                        node: SecuritySchemeObject,
                        location,
                    });
                }
            });
        }

        if (schema.components.links) {
            const {links} = schema.components;
            Object.keys(links).forEach(linkName => {
                const LinkObject = links[linkName];
                const location = ['components', 'links', linkName];
                if (oaUtils.isRef(LinkObject)) {
                    visitors.ReferenceObject.push({
                        node: LinkObject,
                        location,
                    });
                } else {
                    visitors.LinkObject.push({
                        node: LinkObject,
                        location,
                    });
                }
            });
        }

        if (schema.components.callbacks) {
            const {callbacks} = schema.components;
            Object.keys(callbacks).forEach(cbName => {
                const CallbackObject = callbacks[cbName];
                const location = ['components', 'links', cbName];
                if (oaUtils.isRef(CallbackObject)) {
                    visitors.ReferenceObject.push({
                        node: CallbackObject,
                        location,
                    });
                } else {
                    visitors.CallbackObject.push({
                        node: CallbackObject,
                        location,
                    });
                }
            });
        }
    }

    return {visitors};
}
