import { useCreation, useMouse } from 'ahooks';
import { Tabs, TabsProps } from 'antd';
import classNames from 'classnames';

import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useGo } from '@/hooks/web/usePage';
import { multipleTabHeight } from '@/settings/designSetting';
import { useMultipleTabStoreActions } from '@/stores/modules/multipleTab';

import FoldButton from './components/FoldButton';
import SettingButton from './components/SettingButton';
import TabRedo from './components/TabRedo';
import TabTitle from './components/TabTitle';
import { useTabRouter } from './useTabRouter';

import './Index.less';

const Index = () => {
  const { tabs, updateCurrentTabId, currentTabId } = useTabRouter();
  // TODO showQuick
  const { showRedo, showFold } = useMultipleTabSetting();
  const { pageY: mouseY } = useMouse();
  const { prefixCls } = useDesign('multiple-tabs');
  const { closeTabById } = useMultipleTabStoreActions();
  const go = useGo();
  const unClose = tabs.length < 1;
  const wrapperClass = classNames(`${prefixCls}`, {
    [`${prefixCls}--hide-close`]: unClose,
    [`${prefixCls}--hover`]: mouseY < multipleTabHeight,
  });

  const handleEdit: TabsProps['onEdit'] = (id) => {
    closeTabById(id as string, (path) => {
      go(path, true);
    });
  };
  const items = useCreation((): TabsProps['items'] => {
    return tabs.map((tab) => ({
      label: <TabTitle item={tab} />,
      key: tab.id,
      closable: tabs.length > 1,
    }));
  }, [tabs]);

  const onTabChange: TabsProps['onChange'] = (id) => {
    updateCurrentTabId(id);
  };

  return (
    <div className={wrapperClass}>
      <Tabs
        type="editable-card"
        size="small"
        animated={false}
        hideAdd={true}
        tabBarGutter={3}
        onChange={onTabChange}
        items={items}
        onEdit={handleEdit}
        activeKey={currentTabId}
        tabBarExtraContent={
          <>
            <SettingButton />
            {showRedo && <TabRedo />}
            {showFold && <FoldButton />}
          </>
        }
      />
    </div>
  );
};

export default Index;
