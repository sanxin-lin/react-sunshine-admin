import { has } from 'lodash-es';

import { useAppStore } from '@/stores/modules/app';

import { useRouterMatched } from './useRouterMatched';

/**
 * @description: Full screen display content
 */
export const useFullContent = () => {
  const projectConfig = useAppStore((state) => state.getProjectConfig());
  const { query } = useRouterMatched();
  // Whether to display the content in full screen without displaying the menu
  const compute = () => {
    // Query parameters, the full screen is displayed when the address bar has a full parameter

    if (query && has(query, '__full__')) {
      return true;
    }
    // Return to the configuration in the configuration file
    return projectConfig.fullContent;
  };

  const fullContent = compute();

  return { fullContent };
};
