import { useEffect, useRef } from 'react';
import { Card } from 'antd';

import { useECharts } from '@/hooks/web/useECharts';

interface IProps {
  loading?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

const VisitSource = (props: IProps) => {
  const { loading, width = '100%', height = '300px', className } = props;

  const chartRef = useRef<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef);

  useEffect(() => {
    if (loading) return;
    setOptions({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '1%',
        left: 'center',
      },
      series: [
        {
          color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '12',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
          ],
          animationType: 'scale',
          animationEasing: 'exponentialInOut',
          animationDelay: function () {
            return Math.random() * 100;
          },
        },
      ],
    });
  }, [loading]);

  return (
    <Card title="访问来源" loading={loading} className={className}>
      <div ref={chartRef} style={{ width, height }}></div>
    </Card>
  );
};

export default VisitSource;
