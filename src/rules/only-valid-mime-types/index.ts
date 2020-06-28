import {SwaggerlintRule, Report, Swagger} from '../../types';
import mimeDB from 'mime-db';

const name = 'only-valid-mime-types';

function isValidMimeType(maybeMime: string): boolean {
    return maybeMime in mimeDB;
}

type Param = {
    node: Swagger.SwaggerObject | Swagger.OperationObject;
    report: Report;
    location: string[];
};
function onlyValidMimeTypeCheck({node, report, location}: Param): void {
    const {consumes, produces} = node;
    if (consumes) {
        consumes.forEach((mType, i) => {
            if (!isValidMimeType(mType)) {
                report(`"${mType}" is not a valid mime type.`, [
                    ...location,
                    'consumes',
                    String(i),
                ]);
            }
        });
    }
    if (produces) {
        produces.forEach((mType, i) => {
            if (!isValidMimeType(mType)) {
                report(`"${mType}" is not a valid mime type.`, [
                    ...location,
                    'produces',
                    String(i),
                ]);
            }
        });
    }
}

const rule: SwaggerlintRule = {
    name,
    swaggerVisitor: {
        SwaggerObject: onlyValidMimeTypeCheck,
        OperationObject: onlyValidMimeTypeCheck,
    },
};

export default rule;
