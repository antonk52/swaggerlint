import {uniqBy} from 'lodash';
import {isRef} from './utils';

import {
    SwaggerObject,
    InfoObject,
    PathsObject,
    DefinitionsObject,
    ParametersDefinitionsObject,
    ResponsesDefinitionsObject,
    SecurityDefinitionsObject,
    SecuritySchemeObject,
    ScopesObject,
    SecurityRequirementObject,
    TagObject,
    ExternalDocumentationObject,
    ContactObject,
    LicenseObject,
    PathItemObject,
    OperationObject,
    ParameterObject,
    ReferenceObject,
    ResponsesObject,
    ResponseObject,
    SchemaObject,
    XMLObject,
    HeadersObject,
    HeaderObject,
    ItemsObject,
    ExampleObject,
    LintError,
    ConfigIgnore,
} from './types';

type OneOrNone<T> = [T] | [];
type NodeWithLocation<T> = {
    node: T;
    location: string[];
};

type Visitors = {
    SwaggerObject: [NodeWithLocation<SwaggerObject>];
    InfoObject: [NodeWithLocation<InfoObject>];
    PathsObject: [NodeWithLocation<PathsObject>];

    DefinitionsObject: OneOrNone<NodeWithLocation<DefinitionsObject>>;
    ParametersDefinitionsObject: OneOrNone<
        NodeWithLocation<ParametersDefinitionsObject>
    >;
    ResponsesDefinitionsObject: OneOrNone<
        NodeWithLocation<ResponsesDefinitionsObject>
    >;
    SecurityDefinitionsObject: OneOrNone<
        NodeWithLocation<SecurityDefinitionsObject>
    >;
    SecuritySchemeObject: NodeWithLocation<SecuritySchemeObject>[];
    ScopesObject: NodeWithLocation<ScopesObject>[];
    SecurityRequirementObject: NodeWithLocation<SecurityRequirementObject>[];
    TagObject: NodeWithLocation<TagObject>[];
    ExternalDocumentationObject: NodeWithLocation<
        ExternalDocumentationObject
    >[];
    ContactObject: OneOrNone<NodeWithLocation<ContactObject>>;
    LicenseObject: OneOrNone<NodeWithLocation<LicenseObject>>;
    PathItemObject: NodeWithLocation<PathItemObject>[];
    OperationObject: NodeWithLocation<OperationObject>[];
    ParameterObject: NodeWithLocation<ParameterObject>[];
    ResponsesObject: NodeWithLocation<ResponsesObject>[];
    ResponseObject: NodeWithLocation<ResponseObject>[];
    SchemaObject: NodeWithLocation<SchemaObject>[];
    XMLObject: NodeWithLocation<XMLObject>[];
    HeadersObject: NodeWithLocation<HeadersObject>[];
    HeaderObject: NodeWithLocation<HeaderObject>[];
    ItemsObject: NodeWithLocation<ItemsObject>[];
    ExampleObject: NodeWithLocation<ExampleObject>[];
};

const httpsMethods: ['get', 'put', 'post', 'delete', 'options', 'head'] = [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
];

type WalkerResult =
    | {
          visitors: Visitors;
      }
    | {
          errors: LintError[];
      };

function walker(
    swagger: SwaggerObject,
    ignore: ConfigIgnore = {},
): WalkerResult {
    try {
        const DEFINITIONS_TO_IGNORE = new Set(ignore.definitions ?? []);
        const PATHS_TO_IGNORE = new Set(ignore.paths ?? []);

        const {securityDefinitions, security, definitions} = swagger;

        /* eslint-disable indent */
        const visitors: Visitors = {
            SwaggerObject: [{node: swagger, location: []}],
            InfoObject: [{node: swagger.info, location: ['info']}],
            PathsObject: [{node: swagger.paths, location: ['paths']}],

            DefinitionsObject: definitions
                ? [{node: definitions, location: ['definitions']}]
                : [],
            ParametersDefinitionsObject: swagger.parameters
                ? [{node: swagger.parameters, location: ['parameters']}]
                : [],
            ResponsesDefinitionsObject: swagger.responses
                ? [{node: swagger.responses, location: ['responses']}]
                : [],
            SecurityDefinitionsObject: securityDefinitions
                ? [
                      {
                          node: securityDefinitions,
                          location: ['securityDefinitions'],
                      },
                  ]
                : [],
            SecuritySchemeObject: securityDefinitions
                ? Object.keys(securityDefinitions).map(key => ({
                      node: securityDefinitions[key],
                      location: ['securityDefinitions', key],
                  }))
                : [],
            ScopesObject: securityDefinitions
                ? Object.keys(securityDefinitions).map(key => ({
                      node: securityDefinitions[key].scopes,
                      location: ['securityDefinitions', key, 'scopes'],
                  }))
                : [],
            SecurityRequirementObject: (security ?? []).map((sro, i) => ({
                node: sro,
                location: ['security', String(i)],
            })),
            TagObject: (swagger.tags ?? []).map((tag, i) => ({
                node: tag,
                location: ['tags', String(i)],
            })),
            ExternalDocumentationObject: swagger.externalDocs
                ? [{node: swagger.externalDocs, location: ['externalDocs']}]
                : [],
            ContactObject: swagger.info.contact
                ? [{node: swagger.info.contact, location: ['info', 'contact']}]
                : [],
            LicenseObject: swagger.info.licence
                ? [{node: swagger.info.licence, location: ['info', 'licence']}]
                : [],
            PathItemObject: [{node: swagger.paths, location: ['paths']}],
            OperationObject: [],
            ParameterObject: [],
            ResponsesObject: [],
            ResponseObject: [],
            SchemaObject: [],
            XMLObject: [],
            HeadersObject: [],
            HeaderObject: [],
            ItemsObject: [],
            ExampleObject: [],
        };
        /* eslint-enable indent */

        type Refs = {
            ParameterObject: ReferenceObject[];
            SchemaObject: ReferenceObject[];
            ResponseObject: ReferenceObject[];
        };
        const refs: Refs = {
            ParameterObject: [],
            SchemaObject: [],
            ResponseObject: [],
        };

        function populateParams(
            parameters: (ParameterObject | ReferenceObject)[],
            path: string[],
        ) {
            parameters.forEach((parameter, i) => {
                if (isRef(parameter)) {
                    refs.ParameterObject.push(parameter);
                } else {
                    visitors.ParameterObject.push({
                        node: parameter,
                        location: [...path, String(i)],
                    });

                    if ('schema' in parameter) {
                        const {schema} = parameter;
                        if (isRef(schema)) {
                            refs.SchemaObject.push(schema);
                        } else {
                            visitors.SchemaObject.push({
                                node: schema,
                                location: [...path, String(i), 'schema'],
                            });

                            // TODO handle allOf property

                            if (schema.externalDocs) {
                                visitors.ExternalDocumentationObject.push({
                                    node: schema.externalDocs,
                                    location: [
                                        ...path,
                                        String(i),
                                        'externalDocs',
                                    ],
                                });
                            }

                            if (schema.xml) {
                                visitors.XMLObject.push({
                                    node: schema.xml,
                                    location: [...path, String(i), 'xml'],
                                });
                            }
                        }
                    }
                }
            });
        }

        function populateItemsObject(itemsObj: ItemsObject, path: string[]) {
            visitors.ItemsObject.push({node: itemsObj, location: path});

            if (itemsObj.type === 'array') {
                populateItemsObject(itemsObj.items, [...path, 'items']);
            }
        }

        function populateSchemaObject(
            schema: SchemaObject,
            path: string[],
        ): void {
            if (isRef(schema)) {
                refs.SchemaObject.push(schema);
            } else {
                visitors.SchemaObject.push({node: schema, location: path});

                if (schema.xml) {
                    visitors.XMLObject.push({
                        node: schema.xml,
                        location: [...path, 'xml'],
                    });
                }

                if ('properties' in schema && schema.properties) {
                    const {properties} = schema;
                    Object.keys(properties).forEach(propName => {
                        const prop = properties[propName];
                        populateSchemaObject(prop, [
                            ...path,
                            'properties',
                            propName,
                        ]);
                    });
                }

                if (
                    'additionalProperties' in schema &&
                    typeof schema.additionalProperties === 'object'
                ) {
                    populateSchemaObject(schema.additionalProperties, [
                        ...path,
                        'additionalProperties',
                    ]);
                }

                if ('allOf' in schema) {
                    schema.allOf.forEach((prop, i) =>
                        populateSchemaObject(prop, [
                            ...path,
                            'allOf',
                            String(i),
                        ]),
                    );
                }

                if (schema.type === 'array') {
                    return populateSchemaObject(schema.items, [
                        ...path,
                        'items',
                    ]);
                }
            }
        }

        // populate from paths down
        Object.keys(swagger.paths).forEach(pathUrl => {
            if (PATHS_TO_IGNORE.has(pathUrl)) return;

            const path = swagger.paths[pathUrl];
            httpsMethods.forEach(method => {
                const operationObject = path[method];

                if (operationObject) {
                    visitors.OperationObject.push({
                        node: operationObject,
                        location: ['paths', pathUrl, method],
                    });

                    if (operationObject.externalDocs) {
                        visitors.ExternalDocumentationObject.push({
                            node: operationObject.externalDocs,
                            location: [
                                'paths',
                                pathUrl,
                                method,
                                'externalDocs',
                            ],
                        });
                    }

                    if (operationObject.parameters) {
                        populateParams(operationObject.parameters, [
                            'paths',
                            pathUrl,
                            method,
                            'parameters',
                        ]);
                    }

                    visitors.ResponsesObject.push({
                        node: operationObject.responses,
                        location: ['paths', pathUrl, method, 'resposes'],
                    });

                    Object.keys(operationObject.responses).forEach(
                        responseHttpCode => {
                            const response =
                                operationObject.responses[responseHttpCode];

                            if (isRef(response)) {
                                refs.ResponseObject.push(response);
                            } else {
                                visitors.ResponseObject.push({
                                    node: response,
                                    location: [
                                        'paths',
                                        pathUrl,
                                        method,
                                        'responses',
                                        responseHttpCode,
                                    ],
                                });
                                if (response.schema) {
                                    populateSchemaObject(response.schema, [
                                        'paths',
                                        pathUrl,
                                        method,
                                        'responses',
                                        responseHttpCode,
                                        'schema',
                                    ]);
                                }
                                const {headers} = response;
                                if (headers) {
                                    visitors.HeadersObject.push({
                                        node: headers,
                                        location: [
                                            'paths',
                                            pathUrl,
                                            method,
                                            'responses',
                                            responseHttpCode,
                                            'headers',
                                        ],
                                    });

                                    Object.keys(headers).forEach(headerName => {
                                        const headerObject =
                                            headers[headerName];
                                        visitors.HeaderObject.push({
                                            node: headerObject,
                                            location: [
                                                'paths',
                                                pathUrl,
                                                method,
                                                'responses',
                                                responseHttpCode,
                                                'headers',
                                                headerName,
                                            ],
                                        });

                                        if (headerObject.type === 'array') {
                                            populateItemsObject(
                                                headerObject.items,
                                                [
                                                    'paths',
                                                    pathUrl,
                                                    method,
                                                    'responses',
                                                    responseHttpCode,
                                                    'headers',
                                                    headerName,
                                                    'items',
                                                ],
                                            );
                                        }
                                    });
                                }
                                if (response.examples) {
                                    visitors.ExampleObject.push({
                                        node: response.examples,
                                        location: [
                                            'paths',
                                            pathUrl,
                                            method,
                                            'responses',
                                            responseHttpCode,
                                            'examples',
                                        ],
                                    });
                                }
                            }
                        },
                    );

                    if (operationObject.security) {
                        operationObject.security.forEach((sro, i) => {
                            visitors.SecurityRequirementObject.push({
                                node: sro,
                                location: [
                                    'paths',
                                    pathUrl,
                                    method,
                                    'security',
                                    String(i),
                                ],
                            });
                        });
                    }
                }
            });

            if (path.parameters) {
                populateParams(path.parameters, [
                    'paths',
                    pathUrl,
                    'parameters',
                ]);
            }
        });

        // remove duplicates
        refs.SchemaObject = uniqBy(refs.SchemaObject, '$ref');
        refs.ResponseObject = uniqBy(refs.ResponseObject, '$ref');
        refs.ParameterObject = uniqBy(refs.ParameterObject, '$ref');

        refs.SchemaObject.forEach(({$ref}) => {
            const refName = $ref.replace('#/definitions/', '');

            if (DEFINITIONS_TO_IGNORE.has(refName)) return;

            if (swagger.definitions && refName in swagger.definitions) {
                const schema = swagger.definitions[refName];

                populateSchemaObject(schema, ['definitions', refName]);
            }
        });

        return {visitors};
    } catch (err) {
        return {
            errors: [
                {
                    name: `swaggerlint-core`,
                    msg: err,
                    location: [],
                },
            ],
        };
    }
}

export default walker;
