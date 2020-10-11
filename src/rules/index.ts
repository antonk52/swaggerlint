import {SwaggerlintRule} from '../types';

/* GENERATED_START(id:main;hash:45f5fb6405bd067f4899e69520107b1f) This is generated content, do not modify by hand, to regenerate run "npm run updateDocs" */
import expressivePathSummary from './expressive-path-summary';
import latinDefinitionsOnly from './latin-definitions-only';
import noEmptyObjectType from './no-empty-object-type';
import noExternalRefs from './no-external-refs';
import noInlineEnums from './no-inline-enums';
import noSingleAllof from './no-single-allof';
import noTrailingSlash from './no-trailing-slash';
import objectPropCasing from './object-prop-casing';
import onlyValidMimeTypes from './only-valid-mime-types';
import parameterCasing from './parameter-casing';
import pathParamRequiredField from './path-param-required-field';
import requiredOperationTags from './required-operation-tags';
import requiredParameterDescription from './required-parameter-description';
import requiredTagDescription from './required-tag-description';

export const rules: Record<string, SwaggerlintRule<string>> = {
    [expressivePathSummary.name]: expressivePathSummary,
    [latinDefinitionsOnly.name]: latinDefinitionsOnly,
    [noEmptyObjectType.name]: noEmptyObjectType,
    [noExternalRefs.name]: noExternalRefs,
    [noInlineEnums.name]: noInlineEnums,
    [noSingleAllof.name]: noSingleAllof,
    [noTrailingSlash.name]: noTrailingSlash,
    [objectPropCasing.name]: objectPropCasing,
    [onlyValidMimeTypes.name]: onlyValidMimeTypes,
    [parameterCasing.name]: parameterCasing,
    [pathParamRequiredField.name]: pathParamRequiredField,
    [requiredOperationTags.name]: requiredOperationTags,
    [requiredParameterDescription.name]: requiredParameterDescription,
    [requiredTagDescription.name]: requiredTagDescription,
};
/* GENERATED_END(id:main) */
