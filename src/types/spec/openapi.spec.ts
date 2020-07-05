import {OpenAPI} from '../';

/* eslint-disable @typescript-eslint/camelcase */

describe('OpenAPI types', () => {
    it('InfoObject', () => {
        const InfoObject: OpenAPI.InfoObject = {
            title: 'Sample Pet Store App',
            description: 'This is a sample server for a pet store.',
            termsOfService: 'http://example.com/terms/',
            contact: {
                name: 'API Support',
                url: 'http://www.example.com/support',
                email: 'support@example.com',
            },
            license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
            },
            version: '1.0.1',
        };

        InfoObject;
    });

    it('ContactObject', () => {
        const ContactObject: OpenAPI.ContactObject = {
            name: 'API Support',
            url: 'http://www.example.com/support',
            email: 'support@example.com',
        };

        ContactObject;
    });

    it('LicenseObject', () => {
        const LicenseObject: OpenAPI.LicenseObject = {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        };

        LicenseObject;
    });

    it('ServerObject', () => {
        const ServerObject: OpenAPI.ServerObject = {
            url: 'https://development.gigantic-server.com/v1',
            description: 'Development server',
            variables: {
                username: {
                    default: 'demo',
                    description:
                        'this value is assigned by the service provider, in this example `gigantic-server.com`',
                },
                port: {
                    enum: ['8443', '443'],
                    default: '8443',
                },
                basePath: {
                    default: 'v2',
                },
            },
        };

        ServerObject;
    });

    it('ComponentsObject', () => {
        const ComponentsObject: OpenAPI.ComponentsObject = {
            schemas: {
                GeneralError: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'integer',
                            format: 'int32',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64',
                        },
                        name: {
                            type: 'string',
                        },
                    },
                },
                Tag: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64',
                        },
                        name: {
                            type: 'string',
                        },
                    },
                },
            },
            parameters: {
                skipParam: {
                    name: 'skip',
                    in: 'query',
                    description: 'number of items to skip',
                    required: true,
                    schema: {
                        type: 'integer',
                        format: 'int32',
                    },
                },
                limitParam: {
                    name: 'limit',
                    in: 'query',
                    description: 'max records to return',
                    required: true,
                    schema: {
                        type: 'integer',
                        format: 'int32',
                    },
                },
            },
            responses: {
                NotFound: {
                    description: 'Entity not found.',
                },
                IllegalInput: {
                    description: 'Illegal input for operation.',
                },
                GeneralError: {
                    description: 'General Error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GeneralError',
                            },
                        },
                    },
                },
            },
            securitySchemes: {
                api_key: {
                    type: 'apiKey',
                    name: 'api_key',
                    in: 'header',
                },
                petstore_auth: {
                    type: 'oauth2',
                    flows: {
                        implicit: {
                            authorizationUrl:
                                'http://example.org/api/oauth/dialog',
                            scopes: {
                                'write:pets': 'modify pets in your account',
                                'read:pets': 'read your pets',
                            },
                        },
                    },
                },
            },
        };

        ComponentsObject;
    });

    it('PathsObject', () => {
        const PathsObject: OpenAPI.PathsObject = {
            '/pets': {
                get: {
                    description:
                        'Returns all pets from the system that the user has access to',
                    responses: {
                        '200': {
                            description: 'A list of pets.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/pet',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        PathsObject;
    });

    it('PathItemObject', () => {
        const PathItemObject: OpenAPI.PathItemObject = {
            get: {
                description: 'Returns pets based on ID',
                summary: 'Find pets by ID',
                operationId: 'getPetsById',
                responses: {
                    '200': {
                        description: 'pet response',
                        content: {
                            '*/*': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Pet',
                                    },
                                },
                            },
                        },
                    },
                    default: {
                        description: 'error payload',
                        content: {
                            'text/html': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorModel',
                                },
                            },
                        },
                    },
                },
            },
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID of pet to use',
                    required: true,
                    schema: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    style: 'simple',
                },
            ],
        };

        PathItemObject;
    });

    it('OperationObject', () => {
        const OperationObject: OpenAPI.OperationObject = {
            tags: ['pet'],
            summary: 'Updates a pet in the store with form data',
            operationId: 'updatePetWithForm',
            parameters: [
                {
                    name: 'petId',
                    in: 'path',
                    description: 'ID of pet that needs to be updated',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            requestBody: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    description: 'Updated name of the pet',
                                    type: 'string',
                                },
                                status: {
                                    description: 'Updated status of the pet',
                                    type: 'string',
                                },
                            },
                            required: ['status'],
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Pet updated.',
                    content: {
                        'application/json': {},
                        'application/xml': {},
                    },
                },
                '405': {
                    description: 'Method Not Allowed',
                    content: {
                        'application/json': {},
                        'application/xml': {},
                    },
                },
            },
            security: [
                {
                    petstore_auth: ['write:pets', 'read:pets'],
                },
            ],
        };

        OperationObject;
    });

    it('ExternalDocumentationObject', () => {
        const ExternalDocumentationObject: OpenAPI.ExternalDocumentationObject = {
            description: 'Find more info here',
            url: 'https://example.com',
        };

        ExternalDocumentationObject;
    });

    it('ParameterObject', () => {
        const HeaderParameterObject: OpenAPI.ParameterObject = {
            name: 'token',
            in: 'header',
            description: 'token to be passed as a header',
            required: true,
            schema: {
                type: 'array',
                items: {
                    type: 'integer',
                    format: 'int64',
                },
            },
            style: 'simple',
        };

        HeaderParameterObject;

        const PathParameterObject: OpenAPI.ParameterObject = {
            name: 'username',
            in: 'path',
            description: 'username to fetch',
            required: true,
            schema: {
                type: 'string',
            },
        };

        PathParameterObject;

        const QueryParameterObject: OpenAPI.ParameterObject = {
            name: 'id',
            in: 'query',
            description: 'ID of the object to fetch',
            required: false,
            schema: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            style: 'form',
            explode: true,
        };

        QueryParameterObject;

        const FreeFormQueryParam: OpenAPI.ParameterObject = {
            in: 'query',
            name: 'freeForm',
            schema: {
                type: 'object',
                additionalProperties: {
                    type: 'integer',
                },
            },
            style: 'form',
        };

        FreeFormQueryParam;
    });

    it('SchemaObject', () => {
        const SchemaObject: OpenAPI.SchemaObject = {
            type: 'object',
            properties: {
                name: {
                    description: 'Updated name of the pet',
                    type: 'string',
                },
                status: {
                    description: 'Updated status of the pet',
                    type: 'string',
                },
            },
            required: ['status'],
        };

        SchemaObject;
    });
});
