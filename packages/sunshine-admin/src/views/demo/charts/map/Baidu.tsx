import { useRef } from 'react';
import { useMount } from 'ahooks';

import { useScript } from '@/hooks/web/useScript';
import { nextTick } from '@/utils/dom';

interface IProps {
  width?: string;
  height?: string;
}

const Baidu = (props: IProps) => {
  const { width = '100%', height = 'calc(100vh - 78px)' } = props;

  const BAI_DU_MAP_URL =
    'https://api.map.baidu.com/getscript?v=3.0&ak=OaBvYmKX3pjF7YFUFeeBCeGdy9Zp7xB2&services=&t=20210201100830&s=1';

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { toPromise } = useScript({ src: BAI_DU_MAP_URL });

  const initMap = async () => {
    await toPromise();
    await nextTick();
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    const BMap = (window as any).BMap;
    const map = new BMap.Map(wrapEl);
    const point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    map.enableScrollWheelZoom(true);
  };

  useMount(async () => {
    await initMap();
  });

  return <div ref={wrapRef} style={{ height, width }}></div>;
};

export default Baidu;
