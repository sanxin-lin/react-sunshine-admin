import { RefObject, useState } from 'react';
import { useDebounceFn, useKeyPress, useMount } from 'ahooks';
import { cloneDeep } from 'lodash-es';

import { useScrollTo } from '@/hooks/utils/useScrollTo';
import { useLocale } from '@/hooks/web/useLocale';
import { useGo } from '@/hooks/web/usePage';
import { getMenus } from '@/router/menu';
import { filter, forEach } from '@/utils/tree';
import { nextTick } from '@/utils/dom';

import type { Menu } from '#/router';

export interface SearchResult {
  name: string;
  path: string;
  icon?: string;
}

// Translate special characters
function transform(c: string) {
  const code: string[] = ['$', '(', ')', '*', '+', '.', '[', ']', '?', '\\', '^', '{', '}', '|'];
  return code.includes(c) ? `\\${c}` : c;
}

function createSearchReg(key: string) {
  const keys = [...key].map((item) => transform(item));
  const str = ['', ...keys, ''].join('.*');
  return new RegExp(str);
}

export function useSearch(
  refs: RefObject<HTMLElement[]>,
  scrollWrap: RefObject<HTMLUListElement>,
  onClose?: () => void,
) {
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [keyword, setKeyword] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  let menuList: Menu[] = [];

  const { t } = useLocale();
  const go = useGo();
  const { run: handleSearch } = useDebounceFn(search, {
    wait: 200,
  });

  useMount(async () => {
    const list = await getMenus();
    menuList = cloneDeep(list);
    forEach(menuList, (item) => {
      item.name = t(item.handle?.title || item.name);
    });
  });

  function search(e: any) {
    e?.stopPropagation();
    const key = e.target.value;
    const _keyword = key.trim();
    setKeyword(_keyword);
    if (!key) {
      setSearchResult([]);
      return;
    }
    const reg = createSearchReg(_keyword);
    const filterMenu = filter(menuList, (item) => {
      return reg.test(item.name?.toLowerCase()) && !item.hidden;
    });
    setSearchResult(handlerSearchResult(filterMenu, reg));
    setActiveIndex(0);
  }

  function handlerSearchResult(filterMenu: Menu[], reg: RegExp, parent?: Menu) {
    const ret: SearchResult[] = [];
    filterMenu.forEach((item) => {
      const { name, path, icon, children, hidden, handle } = item;
      if (
        !hidden &&
        reg.test(name?.toLowerCase()) &&
        (!children?.length || handle?.hideChildrenInMenu)
      ) {
        ret.push({
          name: parent?.name ? `${parent.name} > ${name}` : name,
          path,
          icon,
        });
      }
      if (!handle?.hideChildrenInMenu && Array.isArray(children) && children.length) {
        ret.push(...handlerSearchResult(children, reg, item));
      }
    });
    return ret;
  }

  // Activate when the mouse moves to a certain line
  function handleMouseenter(e: any) {
    const index = e.target.dataset.index;
    setActiveIndex(Number(index));
  }

  // Arrow key up
  function handleUp() {
    if (!searchResult.length) return;
    let _activeIndex = activeIndex;
    _activeIndex--;
    if (_activeIndex < 0) {
      _activeIndex = searchResult.length - 1;
    }
    setActiveIndex(_activeIndex);
    handleScroll();
  }

  // Arrow key down
  function handleDown() {
    if (!searchResult.length) return;
    let _activeIndex = activeIndex;
    _activeIndex++;
    if (_activeIndex > searchResult.length - 1) {
      _activeIndex = 0;
    }
    setActiveIndex(_activeIndex);
    handleScroll();
  }

  // When the keyboard up and down keys move to an invisible place
  // the scroll bar needs to scroll automatically
  function handleScroll() {
    const refList = refs;
    if (!refList || !Array.isArray(refList) || refList.length === 0 || !scrollWrap) {
      return;
    }

    const index = activeIndex;
    const currentRef = refList[index];
    if (!currentRef) {
      return;
    }
    const wrapEl = scrollWrap;
    if (!wrapEl.current) {
      return;
    }
    const scrollHeight = currentRef.offsetTop + currentRef.offsetHeight;
    const wrapHeight = wrapEl.current.offsetHeight;
    const { start } = useScrollTo({
      el: wrapEl,
      duration: 100,
      to: scrollHeight - wrapHeight,
    });
    start();
  }

  // enter keyboard event
  async function handleEnter() {
    if (!searchResult.length) {
      return;
    }
    const result = searchResult;
    const index = activeIndex;
    if (result.length === 0 || index < 0) {
      return;
    }
    const to = result[index];
    handleClose();
    await nextTick();
    go(to.path);
  }

  // close search modal
  function handleClose() {
    setSearchResult([]);
    onClose?.();
  }

  // enter search
  useKeyPress('enter', handleEnter);
  // Monitor keyboard arrow keys
  useKeyPress('uparrow', handleUp);
  useKeyPress('downarrow', handleDown);
  // esc close
  useKeyPress('esc', handleClose);

  return {
    handleSearch,
    searchResult,
    keyword,
    activeIndex,
    handleMouseenter,
    handleEnter,
    handleClose,
  };
}
