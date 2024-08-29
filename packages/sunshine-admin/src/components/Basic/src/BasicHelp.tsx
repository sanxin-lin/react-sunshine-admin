import { ReactNode } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useCreation } from 'ahooks';
import { Tooltip } from 'antd';
import { isArray, isString } from 'lodash-es';

import { useDesign } from '@/hooks/web/useDesign';
import { getPopupContainer } from '@/utils/dom';

import './BasicHelp.less';

interface IProps {
  maxWidth?: string;
  showIndex?: boolean;
  color?: string;
  fontSize?: string;
  placement?: string;
  text?: string[] | string | ReactNode;
  children?: ReactNode;
  className?: string;
}

const BasicHelp = (props: IProps) => {
  const {
    maxWidth = '600px',
    showIndex,
    color = '#ffffff',
    fontSize = '14px',
    placement = 'right',
    text,
    children,
    className = '',
  } = props;

  const { prefixCls } = useDesign('basic-help');

  const tooltipStyle = useCreation(() => {
    return { color, fontSize };
  }, [color, fontSize]);

  const overlayStyle = useCreation(() => {
    return { maxWidth };
  }, [maxWidth]);

  const renderTitle = () => {
    if (isString(text)) {
      return <p>{text}</p>;
    }

    if (isArray(text)) {
      return text.map((item, index) => {
        return (
          <p key={item}>
            <>
              {showIndex ? `${index + 1}. ` : ''}
              {item}
            </>
          </p>
        );
      });
    }
    return <div>{text}</div>;
  };

  return (
    <Tooltip
      className={className}
      overlayClassName={`${prefixCls}__wrap`}
      title={<div style={tooltipStyle}>{renderTitle()}</div>}
      autoAdjustOverflow={true}
      overlayStyle={overlayStyle}
      placement={placement as 'right'}
      getPopupContainer={() => getPopupContainer()}
    >
      <span className={prefixCls}>{children || <InfoCircleOutlined />}</span>
    </Tooltip>
  );
};

export default BasicHelp;
