import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';

import './ModalClose.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  canFullscreen?: boolean;
  fullScreen?: boolean;
  onCancel?: (e: Event) => void;
  onFullScreen?: (e: Event) => void;
}

const ModalClose = (props: IProps) => {
  const {
    canFullscreen = true,
    fullScreen,
    className,
    onFullScreen,
    onCancel,
    ...wrapperProps
  } = props;
  const { prefixCls } = useDesign('basic-modal-close');
  const { t } = useLocale();

  const wrapperClass = classNames(`${prefixCls} ${prefixCls}--custom ${className}`, {
    [`${prefixCls}--can-full`]: props.canFullscreen,
  });

  const handleCancel: any = (e: Event) => {
    onCancel?.(e);
  };

  const handleFullScreen: any = (e: Event) => {
    e?.stopPropagation();
    e?.preventDefault();
    onFullScreen?.(e);
  };

  return (
    <div {...wrapperProps} className={wrapperClass}>
      {canFullscreen && (
        <>
          {fullScreen ? (
            <Tooltip title={t('component.modal.restore')} placement="bottom">
              <FullscreenExitOutlined role="full" onClick={handleFullScreen} />
            </Tooltip>
          ) : (
            <Tooltip title={t('component.modal.maximize')} placement="bottom" v-else>
              <FullscreenOutlined role="close" onClick={handleFullScreen} />
            </Tooltip>
          )}
        </>
      )}
      <Tooltip title={t('component.modal.close')} placement="bottom">
        <CloseOutlined onClick={handleCancel} />
      </Tooltip>
    </div>
  );
};

export default ModalClose;
