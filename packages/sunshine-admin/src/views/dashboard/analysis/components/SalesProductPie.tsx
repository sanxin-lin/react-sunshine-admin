import { useEffect, useRef } from 'react';
import { Card } from 'antd';

import { useECharts } from '@/hooks/web/useECharts';

interface IProps {
  loading?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

const SalesProductPie = (props: IProps) => {
  const { loading, width = '100%', height = '300px', className } = props;

  const chartRef = useRef<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef);

  useEffect(() => {
    if (loading) return;
    setOptions({
      tooltip: {
        trigger: 'item',
      },

      series: [
        {
          name: '成交占比',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
          data: [
            { value: 500, name: '电子产品' },
            { value: 310, name: '服装' },
            { value: 274, name: '化妆品' },
            { value: 400, name: '家居' },
          ].sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          animationType: 'scale',
          animationEasing: 'exponentialInOut',
          animationDelay: function () {
            return Math.random() * 400;
          },
        },
      ],
    });
  }, [loading]);

  return (
    <Card title="成交占比" loading={loading} className={className}>
      <div ref={chartRef} style={{ width, height }}></div>
    </Card>
  );
};

export default SalesProductPie;
