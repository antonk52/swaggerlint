import {Rule, Report, SwaggerObject, OperationObject} from '../../types';
import mimeDB from 'mime-db';

const name = 'only-valid-mime-types';

function isValidMimeType(maybeMime: string): boolean {
    return maybeMime in mimeDB;
}

type Param = {
    node: SwaggerObject | OperationObject;
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

const rule: Rule = {
    name,
    visitor: {
        SwaggerObject: arg => onlyValidMimeTypeCheck(arg),
        OperationObject: arg => onlyValidMimeTypeCheck(arg),
    },
};

export default rule;
