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
} from './types';

type OneOrNone<T> = [T] | [];

type Visitors = {
    SwaggerObject: [SwaggerObject];
    InfoObject: [InfoObject];
    PathsObject: [PathsObject];

    DefinitionsObject: OneOrNone<DefinitionsObject>;
    ParametersDefinitionsObject: OneOrNone<ParametersDefinitionsObject>;
    ResponsesDefinitionsObject: OneOrNone<ResponsesDefinitionsObject>;
    SecurityDefinitionsObject: OneOrNone<SecurityDefinitionsObject>;
    SecuritySchemeObject: SecuritySchemeObject[];
    ScopesObject: ScopesObject[];
    SecurityRequirementObject: SecurityRequirementObject[];
    TagObject: TagObject[];
    ExternalDocumentationObject: ExternalDocumentationObject[];
    ContactObject: OneOrNone<ContactObject>;
    LicenseObject: OneOrNone<LicenseObject>;
    PathItemObject: PathItemObject[];
    OperationObject: OperationObject[];
    ParameterObject: ParameterObject[];
    ResponsesObject: ResponsesObject[];
    ResponseObject: ResponseObject[];
    SchemaObject: SchemaObject[];
    XMLObject: XMLObject[];
    HeadersObject: HeadersObject[];
    HeaderObject: HeaderObject[];
    ItemsObject: ItemsObject[];
    ExampleObject: ExampleObject[];
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

function walker(swagger: SwaggerObject): WalkerResult {
    try {
        const paths = Object.values(swagger.paths);

        const visitors: Visitors = {
            SwaggerObject: [swagger],
            InfoObject: [swagger.info],
            PathsObject: [swagger.paths],

            DefinitionsObject: swagger.definitions ? [swagger.definitions] : [],
            ParametersDefinitionsObject: swagger.parameters
                ? [swagger.parameters]
                : [],
            ResponsesDefinitionsObject: swagger.responses
                ? [swagger.responses]
                : [],
            SecurityDefinitionsObject: swagger.securityDefinitions
                ? [swagger.securityDefinitions]
                : [],
            SecuritySchemeObject: swagger.securityDefinitions
                ? Object.values(swagger.securityDefinitions)
                : [],
            ScopesObject: swagger.securityDefinitions
                ? Object.values(swagger.securityDefinitions).map(x => x.scopes)
                : [],
            SecurityRequirementObject: swagger.security ?? [],
            TagObject: swagger.tags ?? [],
            ExternalDocumentationObject: swagger.externalDocs
                ? [swagger.externalDocs]
                : [],
            ContactObject: swagger.info.contact ? [swagger.info.contact] : [],
            LicenseObject: swagger.info.licence ? [swagger.info.licence] : [],
            PathItemObject: paths,
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
        ) {
            parameters.forEach(parameter => {
                if (isRef(parameter)) {
                    refs.ParameterObject.push(parameter);
                } else {
                    visitors.ParameterObject.push(parameter);

                    if ('schema' in parameter) {
                        const {schema} = parameter;
                        if (isRef(schema)) {
                            refs.SchemaObject.push(schema);
                        } else {
                            visitors.SchemaObject.push(schema);

                            // TODO handle allOf property

                            // TODO - move to externalDocs helper
                            if (schema.externalDocs) {
                                visitors.ExternalDocumentationObject.push(
                                    schema.externalDocs,
                                );
                            }

                            // TODO - move to xml helper
                            if (schema.xml) {
                                visitors.XMLObject.push(schema.xml);
                            }
                        }
                    }
                }
            });
        }

        function populateItemsObject(itemsObj: ItemsObject) {
            visitors.ItemsObject.push(itemsObj);

            if (itemsObj.type === 'array') {
                populateItemsObject(itemsObj.items);
            }
        }

        function populateSchemaObject(schema: SchemaObject): void {
            if (isRef(schema)) {
                refs.SchemaObject.push(schema);
            } else {
                visitors.SchemaObject.push(schema);

                if (schema.xml) {
                    visitors.XMLObject.push(schema.xml);
                }

                if ('properties' in schema && schema.properties) {
                    Object.values(schema.properties).forEach(prop =>
                        populateSchemaObject(prop),
                    );
                }

                if (
                    'additionalProperties' in schema &&
                    typeof schema.additionalProperties === 'object'
                ) {
                    populateSchemaObject(schema.additionalProperties);
                }

                if ('allOf' in schema) {
                    schema.allOf.forEach(prop => populateSchemaObject(prop));
                }

                if (schema.type === 'array') {
                    return populateSchemaObject(schema.items);
                }
            }
        }

        // populate from paths below
        paths.forEach(path => {
            httpsMethods.forEach(method => {
                const operationObject = path[method];

                if (operationObject) {
                    visitors.OperationObject.push(operationObject);

                    if (operationObject.externalDocs) {
                        visitors.ExternalDocumentationObject.push(
                            operationObject.externalDocs,
                        );
                    }

                    operationObject.parameters &&
                        populateParams(operationObject.parameters);

                    visitors.ResponsesObject.push(operationObject.responses);

                    Object.values(operationObject.responses).forEach(
                        response => {
                            if (isRef(response)) {
                                refs.ResponseObject.push(response);
                            } else {
                                visitors.ResponseObject.push(response);
                                if (response.schema) {
                                    populateSchemaObject(response.schema);
                                }
                                if (response.headers) {
                                    visitors.HeadersObject.push(
                                        response.headers,
                                    );

                                    Object.values(response.headers).forEach(
                                        headerObject => {
                                            visitors.HeaderObject.push(
                                                headerObject,
                                            );

                                            if (headerObject.type === 'array') {
                                                populateItemsObject(
                                                    headerObject.items,
                                                );
                                            }
                                        },
                                    );
                                }
                                if (response.examples) {
                                    visitors.ExampleObject.push(
                                        response.examples,
                                    );
                                }
                            }
                        },
                    );

                    if (operationObject.security) {
                        visitors.SecurityRequirementObject.push(
                            ...operationObject.security,
                        );
                    }
                }
            });

            path.parameters && populateParams(path.parameters);
        });

        // remove duplicates
        refs.SchemaObject = uniqBy(refs.SchemaObject, '$ref');
        refs.ResponseObject = uniqBy(refs.ResponseObject, '$ref');
        refs.ParameterObject = uniqBy(refs.ParameterObject, '$ref');

        refs.SchemaObject.forEach(({$ref}) => {
            const refName = $ref.replace('#/definitions/', '');

            if (swagger.definitions && refName in swagger.definitions) {
                const schema = swagger.definitions[refName];

                populateSchemaObject(schema);
            }
        });

        return {visitors};
    } catch (err) {
        return {
            errors: [
                {
                    name: `swaggerlint-walker`,
                    msg: err,
                },
            ],
        };
    }
}

export default walker;
