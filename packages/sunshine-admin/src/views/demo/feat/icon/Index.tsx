import { useState } from 'react';
import {
  AlipayCircleFilled,
  CodepenCircleFilled,
  GithubFilled,
  IeCircleFilled,
  QqCircleFilled,
  TaobaoCircleFilled,
  WechatFilled,
} from '@ant-design/icons';
import { Alert, Button } from 'antd';

import { CollapseContainer } from '@/components/Container';
import { Icon, IconPicker, SvgIcon } from '@/components/Icon';
import { PageWrapper } from '@/components/Page';
import { openWindow } from '@/utils';

const Index = () => {
  const [iconPickerValue1, setIconPickerValue1] = useState('');
  const [iconPickerValue2, setIconPickerValue2] = useState('');

  return (
    <PageWrapper title="Icon组件示例">
      <CollapseContainer title="Antd Icon使用 (直接按需引入相应组件即可)">
        <div className="flex justify-around">
          <GithubFilled style={{ fontSize: '30px' }} />
          <QqCircleFilled style={{ fontSize: '30px' }} />
          <WechatFilled style={{ fontSize: '30px' }} />
          <AlipayCircleFilled style={{ fontSize: '30px' }} />
          <IeCircleFilled style={{ fontSize: '30px' }} />
          <TaobaoCircleFilled style={{ fontSize: '30px' }} />
          <CodepenCircleFilled style={{ fontSize: '30px' }} />
        </div>
      </CollapseContainer>

      <CollapseContainer title="IconIfy 组件使用" className="my-5">
        <div className="flex justify-around flex-wrap">
          <Icon icon="ion:layers-outline" size="30" />
          <Icon icon="ion:bar-chart-outline" size="30" />
          <Icon icon="ion:tv-outline" size="30" />
          <Icon icon="ion:settings-outline" size="30" />
        </div>
      </CollapseContainer>

      <CollapseContainer title="svg 雪碧图" className="my-5">
        <div className="flex justify-around flex-wrap">
          <SvgIcon name="test" size="32" />
          {new Array(6).fill(0).map((_, index) => (
            <SvgIcon key={index} name={`dynamic-avatar-${index + 1}`} size="32" />
          ))}
        </div>
      </CollapseContainer>

      <CollapseContainer title="图标选择器(Iconify)" className="my-5">
        <div className="flex justify-around flex-wrap">
          <IconPicker value={iconPickerValue1} onChange={(v) => setIconPickerValue1(v)} />
        </div>
      </CollapseContainer>

      <CollapseContainer title="图标选择器(Svg)" className="my-5">
        <div className="flex justify-around flex-wrap">
          <IconPicker
            mode="svg"
            value={iconPickerValue2}
            onChange={(v) => setIconPickerValue2(v)}
          />
        </div>
      </CollapseContainer>

      <Alert
        showIcon
        message="推荐使用Iconify组件"
        description="Icon组件基本包含所有的图标,在下面网址内你可以查询到你想要的任何图标。并且打包只会打包所用到的图标。"
      />
      <Button type="link" onClick={() => openWindow('https://iconify.design/')}>
        Iconify 图标大全
      </Button>
    </PageWrapper>
  );
};

export default Index;
