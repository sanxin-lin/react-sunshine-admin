import type { CardProps } from 'antd';
import { Button, Card } from 'antd';

import { Icon } from '@/components/Icon';
import { useDesign } from '@/hooks/web/useDesign';

import { groupItems } from './data';

import './ProjectCard.less';

interface IProps extends CardProps {}

const ProjectCard = (props: IProps) => {
  const { prefixCls } = useDesign('project-card');
  return (
    <Card
      {...props}
      title="项目"
      extra={
        <Button type="link" size="small">
          更多
        </Button>
      }
      className={`${prefixCls} ${props.className}`}
    >
      <>
        {groupItems.map((item) => (
          <Card.Grid className="!md:w-1/3 !w-full" key={item.title}>
            <span className="flex">
              <Icon icon={item.icon} color={item.color} size="30" />
              <span className="text-lg ml-4">{item.title}</span>
            </span>
            <div className="flex mt-2 h-10 text-secondary">{item.desc}</div>
            <div className="flex justify-between text-secondary">
              <span>{item.group}</span>
              <span>{item.date}</span>
            </div>
          </Card.Grid>
        ))}
      </>
    </Card>
  );
};

export default ProjectCard;
