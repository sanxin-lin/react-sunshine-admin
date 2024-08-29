import { useRef } from 'react';
import { useMount } from 'ahooks';

import { useScript } from '@/hooks/web/useScript';
import { nextTick } from '@/utils/dom';

interface IProps {
  width?: string;
  height?: string;
}

const Gaode = (props: IProps) => {
  const { width = '100%', height = 'calc(100vh - 78px)' } = props;

  const A_MAP_URL = 'https://webapi.amap.com/maps?v=2.0&key=d7bb98e7185300250dd5f918c12f484b';

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { toPromise } = useScript({ src: A_MAP_URL });

  const initMap = async () => {
    await toPromise();
    await nextTick();
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    const AMap = (window as any).AMap;
    new AMap.Map(wrapEl, {
      zoom: 11,
      center: [116.397428, 39.90923],
      viewMode: '3D',
    });
  };

  useMount(async () => {
    await initMap();
  });

  return <div ref={wrapRef} style={{ height, width }}></div>;
};

export default Gaode;
