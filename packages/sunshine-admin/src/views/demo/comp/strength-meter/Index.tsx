import { StrengthMeter } from '@/components/StrengthMeter';
import { PageWrapper } from '@/components/Page';

import './Index.less';

const StrengthMeterExample = () => {
  return (
    <PageWrapper title="密码强度校验组件">
      <div className="flex justify-center">
        <div className="demo-wrap p-10">
          <StrengthMeter placeholder="默认" />
          <StrengthMeter placeholder="禁用" disabled />
          <br />
          <StrengthMeter placeholder="隐藏input" showInput={false} value="!@#qwe12345" />
        </div>
      </div>
    </PageWrapper>
  );
};

export default StrengthMeterExample;
