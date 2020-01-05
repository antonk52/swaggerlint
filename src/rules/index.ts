import expressivePathSummary from './expressive-path-summary';
import objPropCasing from './object-prop-casing';
import noEmptyObjectType from './no-empty-object-type';
import noSingleOneof from './no-single-allof';
import latinDefinitionsOnly from './latin-definitions-only';
import pathParamRequiredField from './path-param-required-field';

const rules = {
    [expressivePathSummary.name]: expressivePathSummary,
    [objPropCasing.name]: objPropCasing,
    [noEmptyObjectType.name]: noEmptyObjectType,
    [noSingleOneof.name]: noSingleOneof,
    [latinDefinitionsOnly.name]: latinDefinitionsOnly,
    [pathParamRequiredField.name]: pathParamRequiredField,
};

export default rules;
