import { BellOutlined } from '@ant-design/icons';
import { useCreation } from 'ahooks';
import { Badge, Popover, Tabs, TabsProps } from 'antd';

import { useDesign } from '@/hooks/web/useDesign';
import { useMessage } from '@/hooks/web/useMessage';

import { type ListItem, tabListData } from './data';
import NoticeList from './NoticeList';

import './Index.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const Index = (props: IProps) => {
  const { className } = props;

  const { prefixCls } = useDesign('header-notify');
  const { createMessage } = useMessage();
  const listData = tabListData;
  const count = useCreation(() => {
    let _count = 0;
    for (let i = 0; i < tabListData.length; i++) {
      _count += tabListData[i].list.length;
    }
    return _count;
  }, [tabListData]);
  const onNoticeClick = (record: ListItem) => {
    createMessage.success('你点击了通知，ID=' + record.id);
    // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
    record.titleDelete = !record.titleDelete;
  };

  const items = useCreation((): TabsProps['items'] => {
    return listData.map((item) => ({
      key: item.key,
      label: (
        <>
          {item.name}
          {item.list.length !== 0 && <span>{item.list.length}</span>}
        </>
      ),
      // 绑定title-click事件的通知列表中标题是“可点击”的
      children:
        item.key === '1' ? (
          <NoticeList list={item.list} onTitleClick={onNoticeClick} />
        ) : (
          <NoticeList list={item.list} />
        ),
    }));
  }, [listData]);

  return (
    <div className={`${prefixCls} ${className}`}>
      <Popover
        title=""
        trigger="click"
        content={<Tabs className={`${prefixCls}__overlay`} items={items}></Tabs>}
      >
        <Badge count={count}>
          <BellOutlined />
        </Badge>
      </Popover>
    </div>
  );
};

export default Index;
