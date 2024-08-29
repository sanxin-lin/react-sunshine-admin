import { useEffect, useRef } from 'react';
import { Card } from 'antd';

import { useECharts } from '@/hooks/web/useECharts';

interface IProps {
  loading?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

const SaleRadar = (props: IProps) => {
  const { loading, width = '100%', height = '400px', className } = props;

  const chartRef = useRef<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef);

  useEffect(() => {
    if (loading) return;
    setOptions({
      legend: {
        bottom: 0,
        data: ['Visits', 'Sales'],
      },
      tooltip: {},
      radar: {
        radius: '60%',
        splitNumber: 8,
        indicator: [
          {
            name: '2017',
          },
          {
            name: '2017',
          },
          {
            name: '2018',
          },
          {
            name: '2019',
          },
          {
            name: '2020',
          },
          {
            name: '2021',
          },
        ],
      },
      series: [
        {
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            shadowBlur: 0,
            shadowColor: 'rgba(0,0,0,.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1,
          },
          data: [
            {
              value: [90, 50, 86, 40, 50, 20],
              name: 'Visits',
              itemStyle: {
                color: '#b6a2de',
              },
            },
            {
              value: [70, 75, 70, 76, 20, 85],
              name: 'Sales',
              itemStyle: {
                color: '#67e0e3',
              },
            },
          ],
        },
      ],
    });
  }, [loading]);

  return (
    <Card title="销售统计" loading={loading} className={className}>
      <div ref={chartRef} style={{ width, height }}></div>
    </Card>
  );
};

export default SaleRadar;
