import { useNavigate } from 'react-router-dom';
import { stringify } from 'qs';

import { PageEnum } from '@/enums/pageEnum';
import { REDIRECT_ROUTE_ID } from '@/router/constants';
import { openWindow } from '@/utils';
import { isHttpUrl } from '@/utils/is';

import { useRouterMatched } from './useRouterMatched';

export enum GoType {
  'replace',
  'after',
}

export const useGo = () => {
  const navigate = useNavigate();

  function go(path?: string): void;
  function go(path: string, isReplace: boolean): void;
  function go(path: string, goType: GoType): void;
  function go(path: string = PageEnum.BASE_HOME, goTypeOrIsReplace: boolean | GoType = false) {
    if (!path) return;

    const currentPath = path as string;

    if (isHttpUrl(currentPath)) {
      return openWindow(currentPath);
    }

    const isReplace = goTypeOrIsReplace === true || goTypeOrIsReplace === GoType.replace;
    const isAfter = goTypeOrIsReplace === GoType.after;

    if (isReplace) {
      navigate(currentPath, {
        replace: true,
      });
    } else if (isAfter) {
      navigate(currentPath);
    } else {
      navigate(currentPath);
    }
  }

  return go;
};
export const useRedo = () => {
  const navigate = useNavigate();
  const { currentRoute, query, path } = useRouterMatched();
  const { id } = currentRoute;
  const redo = () => {
    return new Promise<boolean>((resolve) => {
      if (id === REDIRECT_ROUTE_ID) {
        resolve(false);
        return;
      }
      let currentPath = path;
      if (Object.keys(query).length > 0) {
        currentPath = `${currentPath}?${stringify(query)}`;
      }
      navigate(currentPath, {
        replace: true,
      });
    });
  };

  return redo;
};
