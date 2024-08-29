import { useEffect, useState } from 'react';
import { useCreation, useMemoizedFn, useMount } from 'ahooks';
import classNames from 'classnames';
import { isNil } from 'lodash-es';

import { ThemeEnum } from '@/enums/appEnum';
import { useEarliest } from '@/hooks/utils/useEarliest';
import { useGetState } from '@/hooks/utils/useGetState';
import { useDesign } from '@/hooks/web/useDesign';
import { ROOT_UNIQUE_ID } from '@/router/constants';
import { nextTick } from '@/utils/dom';
import { mitt } from '@/utils/mitt';

import { createRootMenuProviderValue, RootMenuContext } from './context';
import {
  MenuCompNameEnum,
  MenuEmitterEvents,
  MenuInfo,
  MenuProps,
  RootMenuContextProps,
} from './types';

import './Menu.less';

import { BaseProps } from '#/compoments';

const Menu: React.FC<MenuProps & BaseProps> = (props) => {
  const {
    theme = ThemeEnum.LIGHT,
    activeName,
    openNames = [],
    accordion = true,
    width = '100%',
    collapsedWidth = '48px',
    indentSize = 16,
    collapse = true,
    activeSubMenuNames = [],
    onSelect,
    children,
    className,
  } = props;
  const { prefixCls } = useDesign('menu');
  const [currentActiveName, setCurrentActiveName] = useState<string | number>('');
  const [openedNames, setOpenedNames, getOpenedNames] = useGetState<(string | number)[]>([]);
  const [isRemoveAllPopup, setIsRemoveAllPopup] = useState(false);
  const setIsRemoveAllPopupFn = useMemoizedFn((flag: boolean) => {
    setIsRemoveAllPopup(flag);
  });

  const rootMenuEmitter = useEarliest(() => mitt<MenuEmitterEvents>());
  // 记录每个 menu 组件的状态
  const menuInfoMap = useEarliest(() => new Map<string, MenuInfo>());

  const wrapperClassNames = classNames(
    `${prefixCls} ${prefixCls}-${theme} ${prefixCls}-vertical ${className}`,
    {
      [`${prefixCls}-collapse`]: collapse,
    },
  );
  useEffect(() => {
    updateOpened(openNames);
  }, [openNames]);

  const updateOpened = (names: (string | number)[]) => {
    setOpenedNames(names);
    rootMenuEmitter.current.emit('on-update-opened', names);
  };
  const addSubMenu = useMemoizedFn((name: string | number) => {
    const currentOpenedNames = getOpenedNames();
    if (currentOpenedNames.includes(name)) return;
    const _openedNames = [...currentOpenedNames, name];
    updateOpened(_openedNames);
  });
  const removeSubMenu = useMemoizedFn((name: string | number) => {
    const currentOpenedNames = getOpenedNames();
    const _openedNames = [...currentOpenedNames.filter((item) => item !== name)];
    updateOpened(_openedNames);
  });
  const removeAll = useMemoizedFn(() => {
    updateOpened([]);
  });
  const sliceByIndex = useMemoizedFn((index: number) => {
    if (index === -1) return;
    // 这里不能用 getOpenedNames ，因为用了， collased 状态下悬浮有问题
    // const currentOpenedNames = getOpenedNames();
    const _openedNames = [...openedNames.slice(0, index + 1)];
    updateOpened(_openedNames);
  });

  const rootProps = useCreation(
    () =>
      ({
        theme,
        activeName,
        openNames,
        accordion,
        width,
        collapsedWidth,
        indentSize,
        collapse,
        activeSubMenuNames,
      }) as Required<MenuProps>,
    [props],
  );
  // 先把根 Menu 记录
  menuInfoMap.current.set(ROOT_UNIQUE_ID, {
    id: ROOT_UNIQUE_ID,
    compName: MenuCompNameEnum.Menu,
    parentId: null,

    props: rootProps,
  });
  const rootMenuContext: RootMenuContextProps = useCreation(
    () => ({
      rootMenuEmitter: rootMenuEmitter.current,
      activeName: currentActiveName,
      menuInfoMap: menuInfoMap.current,
      rootState: {
        addSubMenu,
        removeSubMenu,
        openedNames,
        removeAll,
        isRemoveAllPopup,
        setIsRemoveAllPopup: setIsRemoveAllPopupFn,
        sliceByIndex,
      },
      rootProps,
    }),
    [currentActiveName, openedNames, isRemoveAllPopup],
  );

  useEffect(() => {
    if (!isNil(activeName)) {
      setCurrentActiveName(activeName);
    }
  }, [activeName]);

  const rootMenuProviderValue = createRootMenuProviderValue(rootMenuContext);

  useMount(() => {
    rootMenuEmitter.current.on('on-menu-item-select', (name: string | number) => {
      setCurrentActiveName(name);
      nextTick(() => {
        collapse && removeAll();
      });
      onSelect?.(name);
    });
    rootMenuEmitter.current.on('open-name-change', ({ name, opened }) => {
      const currentOpenedNames = getOpenedNames();
      if (opened && !currentOpenedNames.includes(name)) {
        setOpenedNames((pre) => [...pre, name]);
      } else if (!opened) {
        const index = currentOpenedNames.findIndex((item) => item === name);
        index !== -1 && setOpenedNames((pre) => pre.filter((_, i) => i !== index));
      }
    });
  });
  return (
    <RootMenuContext.Provider value={rootMenuProviderValue}>
      <ul className={wrapperClassNames}>{children}</ul>
    </RootMenuContext.Provider>
  );
};

export default Menu;
