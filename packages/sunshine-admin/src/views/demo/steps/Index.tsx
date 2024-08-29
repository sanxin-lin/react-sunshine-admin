import { useState } from 'react';
import { Button, Tour, TourProps } from 'antd';

import { PageWrapper } from '@/components/Page';
import { useDesign } from '@/hooks/web/useDesign';

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const { prefixVar } = useDesign('');
  const steps: TourProps['steps'] = [
    {
      title: 'Welcome',
      description: 'Hello World! 👋',
    },
    {
      title: 'Collapse Button',
      description: 'This is the menu collapse button.',
      target: () => document.querySelector(`.${prefixVar}-layout-header-trigger`) as HTMLElement,
    },
    {
      title: 'User Action',
      description: 'This is the user function area.',
      target: () => document.querySelector(`.${prefixVar}-layout-header-action`) as HTMLElement,
    },
  ];
  const handleOpen = (val: boolean): void => {
    setCurrent(0);
    setOpen(val);
  };
  const handleChange = (e: number) => {
    setCurrent(e);
  };

  return (
    <PageWrapper title="引导页" content="用于给用户的指引操作">
      <Button type="primary" onClick={() => handleOpen(true)}>
        开始
      </Button>
      <Tour
        current={current}
        open={open}
        steps={steps}
        onClose={() => handleOpen(false)}
        onChange={handleChange}
      />
    </PageWrapper>
  );
};

export default Index;
