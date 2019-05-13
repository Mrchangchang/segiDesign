import { isString, isArray, isNumber, isFunction } from "lodash";

export function isExpectedDesignType(component, expected) {
  const { type } = component;

  if (isString(type)) {
    return expected === type;
  }

  if (isArray(type)) {
    return type.indexOf(expected) !== -1;
  }

  return false;
}

export const COMPONENT_GROUP_DESIGN_TYPE = "__segi-design-component-group__";
