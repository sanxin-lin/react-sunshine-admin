import { useState } from 'react';
import { Card } from 'antd';

import { PageWrapper } from '@/components/Page';

import illustrationImg from '../../../assets/svg/illustration.svg';

import DynamicInfo from './components/DynamicInfo';
import ProjectCard from './components/ProjectCard';
import QuickNav from './components/QuickNav';
import SaleRadar from './components/SaleRadar';
import WorkbenchHeader from './components/WorkbenchHeader';

const Index = () => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <PageWrapper headerContent={<WorkbenchHeader />}>
      <div className="lg:flex">
        <div className="lg:w-7/10 w-full !mr-4 enter-y">
          <ProjectCard loading={loading} className="enter-y" />
          <DynamicInfo loading={loading} className="!my-4 enter-y" />
        </div>
        <div className="lg:w-3/10 w-full enter-y">
          <QuickNav loading={loading} className="enter-y" />

          <Card className="!my-4 enter-y" loading={loading}>
            <img className="xl:h-50 h-30 mx-auto" src={illustrationImg} />
          </Card>

          <SaleRadar loading={loading} className="enter-y" />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Index;
