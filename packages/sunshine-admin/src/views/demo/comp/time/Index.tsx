import { useEarliest } from '@/hooks/utils/useEarliest';
import { useReactive } from 'ahooks';
import { PageWrapper } from '@/components/Page';
import { Time } from '@/components/Time';
import { CollapseContainer } from '@/components/Container';

const Index = () => {
  const now = useEarliest(() => new Date().getTime());
  const state = useReactive({
    time1: now.current - 60 * 3 * 1000,
    time2: now.current - 86400 * 3 * 1000,
  });

  return (
    <PageWrapper title="时间组件示例">
      <CollapseContainer title="基础示例">
        <Time value={state.time1} />
        <br />
        <Time value={state.time2} />
      </CollapseContainer>

      <CollapseContainer title="定时更新" className="my-4">
        <Time value={now.current} step={1} />
        <br />
        <Time value={now.current} step={5} />
      </CollapseContainer>

      <CollapseContainer title="定时更新">
        <Time value={now.current} mode="date" />
        <br />
        <Time value={now.current} mode="datetime" />
        <br />
        <Time value={now.current} />
      </CollapseContainer>
    </PageWrapper>
  );
};

export default Index;
