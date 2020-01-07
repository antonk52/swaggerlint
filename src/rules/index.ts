import expressivePathSummary from './expressive-path-summary';
import latinDefinitionsOnly from './latin-definitions-only';
import noEmptyObjectType from './no-empty-object-type';
import noSingleOneof from './no-single-allof';
import noTrailingSlash from './no-trailing-slash';
import objPropCasing from './object-prop-casing';
import pathParamRequiredField from './path-param-required-field';
import requiredParameterDescription from './required-parameter-description';

const rules = {
    [expressivePathSummary.name]: expressivePathSummary,
    [latinDefinitionsOnly.name]: latinDefinitionsOnly,
    [noEmptyObjectType.name]: noEmptyObjectType,
    [noSingleOneof.name]: noSingleOneof,
    [noTrailingSlash.name]: noTrailingSlash,
    [objPropCasing.name]: objPropCasing,
    [pathParamRequiredField.name]: pathParamRequiredField,
    [requiredParameterDescription.name]: requiredParameterDescription,
};

export default rules;
