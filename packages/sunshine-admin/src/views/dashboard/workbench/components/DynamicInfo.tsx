import { Button, Card, CardProps, List } from 'antd';

import { Icon } from '@/components/Icon';

import { dynamicInfoItems } from './data';

const ListItem = List.Item;
const ListItemMeta = List.Item.Meta;

interface IProps extends CardProps {
  //   className?: string;
}

const DynamicInfo = (props: IProps) => {
  return (
    <Card
      {...props}
      title="最新动态"
      extra={
        <Button type="link" size="small">
          更多
        </Button>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={dynamicInfoItems}
        renderItem={(item, index) => (
          <ListItem key={index}>
            <ListItemMeta
              description={item.date}
              title={
                <>
                  {item.name}
                  <span dangerouslySetInnerHTML={{ __html: item.desc }}></span>
                </>
              }
              avatar={<Icon icon={item.avatar} size={30} />}
            ></ListItemMeta>
          </ListItem>
        )}
      ></List>
    </Card>
  );
};

export default DynamicInfo;
