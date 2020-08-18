import expressivePathSummary from './expressive-path-summary';
import latinDefinitionsOnly from './latin-definitions-only';
import noEmptyObjectType from './no-empty-object-type';
import noExternalRefs from './no-external-refs';
import noInlineEnums from './no-inline-enums';
import noSingleOneof from './no-single-allof';
import noTrailingSlash from './no-trailing-slash';
import objPropCasing from './object-prop-casing';
import onlyValidMimeTypes from './only-valid-mime-types';
import parameterCasing from './parameter-casing';
import pathParamRequiredField from './path-param-required-field';
import requiredOperationTags from './required-operation-tags';
import requiredParameterDescription from './required-parameter-description';
import requiredTagDescription from './required-tag-description';

import {SwaggerlintRule} from '../types';

const rules: Record<string, SwaggerlintRule<string>> = {
    [expressivePathSummary.name]: expressivePathSummary,
    [latinDefinitionsOnly.name]: latinDefinitionsOnly,
    [noEmptyObjectType.name]: noEmptyObjectType,
    [noExternalRefs.name]: noExternalRefs,
    [noInlineEnums.name]: noInlineEnums,
    [noSingleOneof.name]: noSingleOneof,
    [noTrailingSlash.name]: noTrailingSlash,
    [objPropCasing.name]: objPropCasing,
    [onlyValidMimeTypes.name]: onlyValidMimeTypes,
    [parameterCasing.name]: parameterCasing,
    [pathParamRequiredField.name]: pathParamRequiredField,
    [requiredOperationTags.name]: requiredOperationTags,
    [requiredParameterDescription.name]: requiredParameterDescription,
    [requiredTagDescription.name]: requiredTagDescription,
};

export default rules;
