import { FlowChart } from '@/components/FlowChart';
import { PageWrapper } from '@/components/Page';

import demoData from './dataTurbo.json';

const Index = () => {
  return (
    <PageWrapper
      title="流程图"
      content="简单流程图示例,具体功能需要自己完善"
      contentFullHeight
      fixedHeight
    >
      <FlowChart data={demoData} />
    </PageWrapper>
  );
};

export default Index;
