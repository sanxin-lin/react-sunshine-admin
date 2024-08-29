import { Card, Tag } from 'antd';
import classNames from 'classnames';

import { CountTo } from '@/components/CountTo';
import { Icon } from '@/components/Icon';

import { growCardList } from '../data';

interface IProps {
  loading?: boolean;

  className?: string;
}

const GrowCard = (props: IProps) => {
  const { loading = false, className = '' } = props;
  return (
    <div className={`md:flex ${className}`}>
      {growCardList.map((item, index) => (
        <Card
          size="small"
          loading={loading}
          title={item.title}
          className={classNames('md:w-1/4 w-full !md:mt-0', {
            '!md:mr-4': index + 1 < 4,
            '!mt-4': index > 0,
          })}
          extra={<Tag color={item.color}>{item.action}</Tag>}
          key={index}
        >
          <>
            <div className="py-4 px-4 flex justify-between items-center">
              <CountTo prefix="$" startVal={1} endVal={item.value} className="text-2xl" />
              <Icon icon={item.icon} size={40} />
            </div>
            <div className="p-2 px-4 flex justify-between">
              <span>总{item.title}</span>
              <CountTo prefix="$" startVal={1} endVal={item.total} />
            </div>
          </>
        </Card>
      ))}
    </div>
  );
};

export default GrowCard;
