import { RefObject, useRef } from 'react';
import { useMount } from 'ahooks';
import { registerMap } from 'echarts';

import { useECharts } from '@/hooks/web/useECharts';

import { mapData } from './data';

interface IProps {
  width?: string;
  height?: string;
}

const Map = (props: IProps) => {
  const { width = '100%', height = 'calc(100vh - 78px)' } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as RefObject<HTMLDivElement>);

  useMount(async () => {
    const json = (await (await import('./china.json')).default) as any;
    registerMap('china', json);
    setOptions({
      visualMap: [
        {
          min: 0,
          max: 1000,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: false,
          orient: 'horizontal',
          inRange: {
            color: ['#e0ffff', '#006edd'],
            symbolSize: [30, 100],
          },
        },
      ],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, .6)',
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'iphone4',
          type: 'map',
          map: 'china',
          label: {
            show: true,
            color: 'rgb(249, 249, 249)',
            fontSize: 10,
          },
          itemStyle: {
            areaColor: '#2f82ce',
            borderColor: '#0DAAC1',
          },
          data: mapData,
        },
      ],
    });
  });

  return <div ref={chartRef} style={{ height, width }}></div>;
};

export default Map;
