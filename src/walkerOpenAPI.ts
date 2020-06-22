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

    function handleMediaTypeObject(
        MediaTypeObject: OpenAPI.MediaTypeObject,
        location: string[],
    ): void {
        visitors.MediaTypeObject.push({
            node: MediaTypeObject,
            location,
        });

        // TODO: explore MediaTypeObject
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

        // TODO: explore operation object
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

    /**
     * TODO: componentsObject
     */

    return {visitors};
}
