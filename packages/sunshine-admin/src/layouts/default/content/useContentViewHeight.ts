import { useState } from 'react';
import { useCreation } from 'ahooks';
import { create } from 'zustand';

import { useWindowSize } from '@/hooks/web/useWindowSize';

interface ContentStore {
  headerHeight: number;
  footerHeight: number;
  setHeaderHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
}

const useContentStore = create<ContentStore>((set) => ({
  headerHeight: 0,
  footerHeight: 0,

  setHeaderHeight(height: number) {
    set({ headerHeight: height });
  },
  setFooterHeight(height: number) {
    set({ footerHeight: height });
  },
}));

export function useLayoutHeight() {
  const { headerHeight, footerHeight, setFooterHeight, setHeaderHeight } = useContentStore();

  return { headerHeight, footerHeight, setFooterHeight, setHeaderHeight };
}

export function useContentViewHeight() {
  const headerHeight = useContentStore((state) => state.headerHeight);
  const footerHeight = useContentStore((state) => state.footerHeight);
  const [contentHeight, setContentHeight] = useState(window.innerHeight);
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  const viewHeight = contentHeight - headerHeight - footerHeight || 0;

  useWindowSize(
    () => {
      setContentHeight(window.innerHeight);
    },
    { wait: 100, immediate: true },
  );

  return useCreation(
    () => ({
      contentHeight: viewHeight,
      setPageHeight,
      pageHeight,
    }),
    [viewHeight, setPageHeight, pageHeight],
  );
}
