import { useRef } from 'react';
import { useMount } from 'ahooks';

import { useScript } from '@/hooks/web/useScript';
import { nextTick } from '@/utils/dom';

interface IProps {
  width?: string;
  height?: string;
}

const Google = (props: IProps) => {
  const { width = '100%', height = 'calc(100vh - 78px)' } = props;

  const MAP_URL =
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyBQWrGwj4gAzKndcbwD5favT9K0wgty_0&signed_in=true';

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { toPromise } = useScript({ src: MAP_URL });

  const initMap = async () => {
    await toPromise();
    await nextTick();
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    const google = (window as any).google;
    const latLng = { lat: 116.404, lng: 39.915 };
    const map = new google.maps.Map(wrapEl, {
      zoom: 4,
      center: latLng,
    });
    new google.maps.Marker({
      position: latLng,
      map: map,
      title: 'Hello World!',
    });
  };

  useMount(async () => {
    await initMap();
  });

  return <div ref={wrapRef} style={{ height, width }}></div>;
};

export default Google;
