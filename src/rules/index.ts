import objPropCasing from './object-prop-casing';
import propertiesForObjectType from './properties-for-object-type';
import latinDefinitionsOnly from './latin-definitions-only';
import pathParamRequiredField from './path-param-required-field';

const rules = {
    [objPropCasing.name]: objPropCasing.check,
    [propertiesForObjectType.name]: propertiesForObjectType.check,
    [latinDefinitionsOnly.name]: latinDefinitionsOnly.check,
    [pathParamRequiredField.name]: pathParamRequiredField.check,
};

export default rules;
