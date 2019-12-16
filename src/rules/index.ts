import objPropCasing from './object-prop-casing';
import propertiesForObjectType from './properties-for-object-type';
import latinDefinitionsOnly from './latin-definitions-only';

const rules = {
    [objPropCasing.name]: objPropCasing.check,
    [propertiesForObjectType.name]: propertiesForObjectType.check,
    [latinDefinitionsOnly.name]: latinDefinitionsOnly.check,
};

export default rules;
