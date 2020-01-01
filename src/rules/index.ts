import objPropCasing from './object-prop-casing';
import noEmptyObjectType from './no-empty-object-type';
import latinDefinitionsOnly from './latin-definitions-only';
import pathParamRequiredField from './path-param-required-field';

const rules = {
    [objPropCasing.name]: objPropCasing,
    [noEmptyObjectType.name]: noEmptyObjectType,
    [latinDefinitionsOnly.name]: latinDefinitionsOnly,
    [pathParamRequiredField.name]: pathParamRequiredField,
};

export default rules;
