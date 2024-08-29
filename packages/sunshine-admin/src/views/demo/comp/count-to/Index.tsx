import { Card } from 'antd';
import { CountTo } from '@/components/CountTo';
import { PageWrapper } from '@/components/Page';

import './Index.less';

const Index = () => {
  return (
    <PageWrapper title="数字动画示例">
      <Card>
        <Card.Grid className="count-to-demo-card">
          <CountTo prefix="$" color="#409EFF" startVal={1} endVal={200000} duration={8000} />
        </Card.Grid>
        <Card.Grid className="count-to-demo-card">
          <CountTo
            suffix="$"
            color="red"
            startVal={1}
            endVal={300000}
            decimals={2}
            duration={6000}
          />
        </Card.Grid>
        <Card.Grid className="count-to-demo-card">
          <CountTo suffix="$" color="rgb(0,238,0)" startVal={1} endVal={400000} duration={7000} />
        </Card.Grid>
        <Card.Grid className="count-to-demo-card">
          <CountTo
            separator="-"
            color="rgba(138,43,226,.6)"
            startVal={10000}
            endVal={500000}
            duration={8000}
          />
        </Card.Grid>
      </Card>
    </PageWrapper>
  );
};

export default Index;
