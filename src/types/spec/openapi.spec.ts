import {OpenAPI} from '../';

/**
 * the order is the same as the docs
 * @see https://swagger.io/specification/
 */

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

        const ComplexQueryParam: OpenAPI.ParameterObject = {
            in: 'query',
            name: 'coordinates',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['lat', 'long'],
                        properties: {
                            lat: {
                                type: 'number',
                            },
                            long: {
                                type: 'number',
                            },
                        },
                    },
                },
            },
        };

        ComplexQueryParam;
    });

    it('RequestBodyObject', () => {
        const RequestBodyObject: OpenAPI.RequestBodyObject = {
            description: 'user to add to the system',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/User',
                    },
                    examples: {
                        user: {
                            summary: 'User Example',
                            externalValue:
                                'http://foo.bar/examples/user-example.json',
                        },
                    },
                },
                'application/xml': {
                    schema: {
                        $ref: '#/components/schemas/User',
                    },
                    examples: {
                        user: {
                            summary: 'User example in XML',
                            externalValue:
                                'http://foo.bar/examples/user-example.xml',
                        },
                    },
                },
                'text/plain': {
                    examples: {
                        user: {
                            summary: 'User example in Plain text',
                            externalValue:
                                'http://foo.bar/examples/user-example.txt',
                        },
                    },
                },
                '*/*': {
                    examples: {
                        user: {
                            summary: 'User example in other format',
                            externalValue:
                                'http://foo.bar/examples/user-example.whatever',
                        },
                    },
                },
            },
        };

        RequestBodyObject;

        const ArrayRequestBodyObject: OpenAPI.RequestBodyObject = {
            description: 'user to add to the system',
            content: {
                'text/plain': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
            },
        };

        ArrayRequestBodyObject;
    });

    it('MediaTypeObject', () => {
        const MediaTypeObject: OpenAPI.MediaTypeObject = {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Pet',
                },
                examples: {
                    cat: {
                        summary: 'An example of a cat',
                        value: {
                            name: 'Fluffy',
                            petType: 'Cat',
                            color: 'White',
                            gender: 'male',
                            breed: 'Persian',
                        },
                    },
                    dog: {
                        summary: "An example of a dog with a cat's name",
                        value: {
                            name: 'Puma',
                            petType: 'Dog',
                            color: 'Black',
                            gender: 'Female',
                            breed: 'Mixed',
                        },
                        frog: {
                            $ref: '#/components/examples/frog-example',
                        },
                    },
                },
            },
        };

        MediaTypeObject;
    });

    it('EncodingObject', () => {
        const EncodingObject: OpenAPI.EncodingObject = {
            contentType: 'application/xml; charset=utf-8',
        };

        EncodingObject;

        const EncodingObject2: OpenAPI.EncodingObject = {
            contentType: 'image/png, image/jpeg',
            headers: {
                'X-Rate-Limit-Limit': {
                    description:
                        'The number of allowed requests in the current period',
                    schema: {
                        type: 'integer',
                    },
                },
            },
        };

        EncodingObject2;
    });

    it('ResponsesObject', () => {
        const ResponsesObject: OpenAPI.ResponsesObject = {
            '200': {
                description: 'a pet to be returned',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Pet',
                        },
                    },
                },
            },
            default: {
                description: 'Unexpected error',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorModel',
                        },
                    },
                },
            },
        };

        ResponsesObject;
    });

    it('ResponseObject', () => {
        const ResponseObject: OpenAPI.ResponseObject = {
            description: 'A complex object array response',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/VeryComplexType',
                        },
                    },
                },
            },
        };

        ResponseObject;

        const ResponseObject2: OpenAPI.ResponseObject = {
            description: 'A simple string response',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string',
                    },
                },
            },
        };

        ResponseObject2;

        const PlainTextResponseObject: OpenAPI.ResponseObject = {
            description: 'A simple string response',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string',
                        example: 'whoa!',
                    },
                },
            },
            headers: {
                'X-Rate-Limit-Limit': {
                    description:
                        'The number of allowed requests in the current period',
                    schema: {
                        type: 'integer',
                    },
                },
                'X-Rate-Limit-Remaining': {
                    description:
                        'The number of remaining requests in the current period',
                    schema: {
                        type: 'integer',
                    },
                },
                'X-Rate-Limit-Reset': {
                    description:
                        'The number of seconds left in the current period',
                    schema: {
                        type: 'integer',
                    },
                },
            },
        };

        PlainTextResponseObject;

        const NoReturnValueResponseObject: OpenAPI.ResponseObject = {
            description: 'object created',
        };

        NoReturnValueResponseObject;
    });

    it('CallbackObject', () => {
        const CallbackObject: OpenAPI.CallbackObject = {
            '{$request.query.queryUrl}': {
                post: {
                    requestBody: {
                        description: 'Callback payload',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/SomePayload',
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'callback successfully processed',
                        },
                    },
                },
            },
        };

        CallbackObject;

        const TransactionCallback: OpenAPI.CallbackObject = {
            'http://notificationServer.com?transactionId={$request.body#/id}&email={$request.body#/email}': {
                post: {
                    requestBody: {
                        description: 'Callback payload',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/SomePayload',
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'callback successfully processed',
                        },
                    },
                },
            },
        };

        TransactionCallback;
    });

    // ExampleObject ???

    it('LinkObject', () => {
        const LinkObject: OpenAPI.LinkObject = {
            operationId: 'getUserAddressByUUID',
            parameters: {
                userUuid: '$response.body#/uuid',
            },
        };

        LinkObject;

        const LinkObject2: OpenAPI.LinkObject = {
            operationId: '#/paths/~12.0~1repositories~1{username}/get',
            parameters: {
                userUuid: '$response.body#/username',
            },
        };

        LinkObject2;
    });

    it('HeaderObject', () => {
        const HeaderObject: OpenAPI.HeaderObject = {
            description: 'The number of allowed requests in the current period',
            schema: {
                type: 'integer',
            },
        };

        HeaderObject;
    });

    it('TagObject', () => {
        const TagObject: OpenAPI.TagObject = {
            name: 'pet',
            description: 'Pets operations',
        };

        TagObject;
    });

    it('ReferenceObject', () => {
        const ReferenceObject: OpenAPI.ReferenceObject = {
            $ref: 'definitions.json#/Pet',
        };

        ReferenceObject;
    });

    it('SchemaObject', () => {
        const Primitive: OpenAPI.SchemaObject = {
            type: 'string',
            format: 'email',
        };
        Primitive;

        const SimpleModel: OpenAPI.SchemaObject = {
            type: 'object',
            required: ['name'],
            properties: {
                name: {
                    type: 'string',
                },
                address: {
                    $ref: '#/components/schemas/Address',
                },
                age: {
                    type: 'integer',
                    format: 'int32',
                    minimum: 0,
                },
            },
        };
        SimpleModel;

        const ModalWithDict: OpenAPI.SchemaObject = {
            type: 'object',
            additionalProperties: {
                type: 'string',
            },
        };
        ModalWithDict;

        const RefModal: OpenAPI.SchemaObject = {
            type: 'object',
            additionalProperties: {
                $ref: '#/components/schemas/ComplexModel',
            },
        };
        RefModal;

        const ModalWithExample: OpenAPI.SchemaObject = {
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
            required: ['name'],
            example: {
                name: 'Puma',
                id: 1,
            },
        };
        ModalWithExample;

        const ComponentsObjectWithComposition: OpenAPI.ComponentsObject = {
            components: {
                schemas: {
                    ErrorModel: {
                        type: 'object',
                        required: ['message', 'code'],
                        properties: {
                            message: {
                                type: 'string',
                            },
                            code: {
                                type: 'integer',
                                minimum: 100,
                                maximum: 600,
                            },
                        },
                    },
                    ExtendedErrorModel: {
                        allOf: [
                            {
                                $ref: '#/components/schemas/ErrorModel',
                            },
                            {
                                type: 'object',
                                required: ['rootCause'],
                                properties: {
                                    rootCause: {
                                        type: 'string',
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        };
        ComponentsObjectWithComposition;

        const ComponentsObjectWithPolymorphism: OpenAPI.ComponentsObject = {
            components: {
                schemas: {
                    Pet: {
                        type: 'object',
                        discriminator: {
                            propertyName: 'petType',
                        },
                        properties: {
                            name: {
                                type: 'string',
                            },
                            petType: {
                                type: 'string',
                            },
                        },
                        required: ['name', 'petType'],
                    },
                    Cat: {
                        description:
                            'A representation of a cat. Note that `Cat` will be used as the discriminator value.',
                        allOf: [
                            {
                                $ref: '#/components/schemas/Pet',
                            },
                            {
                                type: 'object',
                                properties: {
                                    huntingSkill: {
                                        type: 'string',
                                        description:
                                            'The measured skill for hunting',
                                        default: 'lazy',
                                        enum: [
                                            'clueless',
                                            'lazy',
                                            'adventurous',
                                            'aggressive',
                                        ],
                                    },
                                },
                                required: ['huntingSkill'],
                            },
                        ],
                    },
                    Dog: {
                        description:
                            'A representation of a dog. Note that `Dog` will be used as the discriminator value.',
                        allOf: [
                            {
                                $ref: '#/components/schemas/Pet',
                            },
                            {
                                type: 'object',
                                properties: {
                                    packSize: {
                                        type: 'integer',
                                        format: 'int32',
                                        description:
                                            'the size of the pack the dog is from',
                                        default: 0,
                                        minimum: 0,
                                    },
                                },
                                required: ['packSize'],
                            },
                        ],
                    },
                },
            },
        };
        ComponentsObjectWithPolymorphism;

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

    it('DiscriminatorObject', () => {
        const DiscriminatorObject: OpenAPI.DiscriminatorObject = {
            propertyName: 'petType',
            mapping: {
                dog: 'Dog',
            },
        };
        DiscriminatorObject;
    });

    it('XMLObject', () => {
        const XMLObject: OpenAPI.XMLObject = {
            name: 'aliens',
            wrapped: true,
        };
        XMLObject;
    });

    it('SecuritySchemeObject & OAuthFlowObject', () => {
        const BasicAuth: OpenAPI.SecuritySchemeObject = {
            type: 'http',
            scheme: 'basic',
        };
        BasicAuth;

        const APIKey: OpenAPI.SecuritySchemeObject = {
            type: 'apiKey',
            name: 'api_key',
            in: 'header',
        };
        APIKey;

        const JWTBearer: OpenAPI.SecuritySchemeObject = {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        };
        JWTBearer;

        const OAuth2: OpenAPI.SecuritySchemeObject = {
            type: 'oauth2',
            flows: {
                implicit: {
                    authorizationUrl: 'https://example.com/api/oauth/dialog',
                    scopes: {
                        'write:pets': 'modify pets in your account',
                        'read:pets': 'read your pets',
                    },
                },
            },
        };
        OAuth2;

        const OAuth2Flows: OpenAPI.SecuritySchemeObject = {
            type: 'oauth2',
            flows: {
                implicit: {
                    authorizationUrl: 'https://example.com/api/oauth/dialog',
                    scopes: {
                        'write:pets': 'modify pets in your account',
                        'read:pets': 'read your pets',
                    },
                },
                authorizationCode: {
                    authorizationUrl: 'https://example.com/api/oauth/dialog',
                    tokenUrl: 'https://example.com/api/oauth/token',
                    scopes: {
                        'write:pets': 'modify pets in your account',
                        'read:pets': 'read your pets',
                    },
                },
            },
        };
        OAuth2Flows;
    });

    it('SecurityRequirementObject', () => {
        const SecurityRequirementObject: OpenAPI.SecurityRequirementObject = {
            petstore_auth: ['write:pets', 'read:pets'],
        };
        SecurityRequirementObject;
    });
});
