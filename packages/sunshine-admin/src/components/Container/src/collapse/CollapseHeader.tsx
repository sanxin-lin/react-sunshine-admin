import { ReactNode } from 'react';

import { BasicArrow, BasicTitle } from '@/components/Basic';
import { useDesign } from '@/hooks/web/useDesign';

interface IProps {
  prefixCls?: string;
  title?: ReactNode;
  show?: boolean;
  canExpand?: boolean;
  helpMessage?: string[] | string;

  className?: string;

  action?: ReactNode;

  onExpand?: () => void;
}

const CollapseHeader = (props: IProps) => {
  const { title, show, canExpand, helpMessage = '', className = '', action, onExpand } = props;
  const { prefixCls } = useDesign('collapse-container');
  const _prefixCls = props.prefixCls ?? prefixCls;

  const onClick = () => {
    onExpand?.();
  };

  const renderAction = () => {
    if (action) return <div onClick={onClick}>{action}</div>;

    if (!canExpand) return null;
    return <BasicArrow up expand={show} onClick={onClick} />;
  };

  return (
    <div className={`${_prefixCls}__header px-2 py-5 ${className}`}>
      <BasicTitle helpMessage={helpMessage} normal>
        {title}
      </BasicTitle>
      <div className={`${_prefixCls}__action`}>{renderAction()}</div>
    </div>
  );
};

export default CollapseHeader;
