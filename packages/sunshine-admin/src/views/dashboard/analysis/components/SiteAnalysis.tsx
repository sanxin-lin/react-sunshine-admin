import { useState } from 'react';
import { Card } from 'antd';

import VisitAnalysis from './VisitAnalysis';
import VisitAnalysisBar from './VisitAnalysisBar';

interface IProps {
  className?: string;
  loading?: boolean;
}

const SiteAnalysis = (props: IProps) => {
  const [activeKey, setActiveKey] = useState('tab1');

  const tabListTitle = [
    {
      key: 'tab1',
      tab: '流量趋势',
    },
    {
      key: 'tab2',
      tab: '访问量',
    },
  ];

  const onTabChange = (key: string) => {
    setActiveKey(key);
  };

  const showTab1 = activeKey === 'tab1';
  const showTab2 = activeKey === 'tab2';

  return (
    <Card {...props} tabList={tabListTitle} activeTabKey={activeKey} onTabChange={onTabChange}>
      {showTab1 && (
        <div className="mb-4">
          <VisitAnalysis />
        </div>
      )}
      {showTab2 && (
        <div className="mb-4">
          <VisitAnalysisBar />
        </div>
      )}
    </Card>
  );
};

export default SiteAnalysis;
