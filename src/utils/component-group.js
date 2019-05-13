import { uniqueId, startsWith, isEmpty } from 'lodash';

import { COMPONENT_GROUP_DESIGN_TYPE } from './design-type';

/**
 * Check if component array is grouped.
 *
 * A grouped component array MUST have a group component as its first element.
 * @param {Array} components
 */
export function isGrouped(components) {
    // Grouped components must have at least 2 elements
    if (!components || components.length < 2) {
      return false;
    }
  
    const possiblyGroup = components[0];
    return isGroupComponent(possiblyGroup);
  }