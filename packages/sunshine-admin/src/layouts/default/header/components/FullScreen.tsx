import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { Tooltip } from 'antd';

import { useLocale } from '@/hooks/web/useLocale';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const FullScreen = (props: IProps) => {
  const { className } = props;
  const { t } = useLocale();

  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);

  const title = isFullscreen
    ? t('layout.header.tooltipExitFull')
    : t('layout.header.tooltipEntryFull');

  return (
    <Tooltip className={className} title={title} placement="bottom" mouseEnterDelay={0.5}>
      <span onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </span>
    </Tooltip>
  );
};

export default FullScreen;
