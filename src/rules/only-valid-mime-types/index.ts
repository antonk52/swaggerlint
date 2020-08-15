import {Report, Swagger} from '../../types';
import {createRule} from '../../utils';
import mimeDB from 'mime-db';

const name = 'only-valid-mime-types';
const messages = {
    invalid: '"{{mimeType}}" is not a valid mime type.',
};

function isValidMimeType(maybeMime: string): boolean {
    return maybeMime in mimeDB;
}

type Param = {
    node: Swagger.SwaggerObject | Swagger.OperationObject;
    report: Report<keyof typeof messages>;
    location: string[];
};
function onlyValidMimeTypeCheck({node, report, location}: Param): void {
    const {consumes, produces} = node;
    if (consumes) {
        consumes.forEach((mType, i) => {
            if (!isValidMimeType(mType)) {
                report({
                    messageId: 'invalid',
                    data: {
                        mimeType: mType,
                    },
                    location: [...location, 'consumes', String(i)],
                });
            }
        });
    }
    if (produces) {
        produces.forEach((mType, i) => {
            if (!isValidMimeType(mType)) {
                report({
                    messageId: 'invalid',
                    data: {
                        mimeType: mType,
                    },
                    location: [...location, 'produces', String(i)],
                });
            }
        });
    }
}

const rule = createRule({
    name,
    meta: {messages},
    swaggerVisitor: {
        SwaggerObject: onlyValidMimeTypeCheck,
        OperationObject: onlyValidMimeTypeCheck,
    },
    openapiVisitor: {
        MediaTypeObject: ({location, report}): void => {
            const mimeType = location[location.length - 1];
            if (!isValidMimeType(mimeType)) {
                report({
                    messageId: 'invalid',
                    data: {
                        mimeType,
                    },
                });
            }
        },
    },
});

export default rule;
