import { useState } from 'react';
import { RedoOutlined } from '@ant-design/icons';

import { useDesign } from '@/hooks/web/useDesign';

import { useTabs } from '../useTabs';

import './TabRedo.less';

const TabRedo = () => {
  const { prefixCls } = useDesign('multiple-tabs-content');
  const { refreshPage } = useTabs();
  const [loading, setLoading] = useState(false);

  const handleRedo = () => {
    setLoading(true);
    refreshPage();
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <span className={`${prefixCls}__extra-redo`} onClick={handleRedo}>
      <RedoOutlined spin={loading} />
    </span>
  );
};

export default TabRedo;
