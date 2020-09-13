import Ajv from 'ajv';
import type {JSONSchema7} from 'json-schema';

type JSONValue = object | boolean | string | null | Array<JSONValue>;

export const validate = (schema: JSONSchema7, json: JSONValue) => {
    const ajv = new Ajv({allErrors: true, verbose: true});
    const validator = ajv.compile(schema);

    validator(json);

    return validator.errors || [];
};
