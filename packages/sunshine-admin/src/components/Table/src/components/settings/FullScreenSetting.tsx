import { useLocale } from '@/hooks/web/useLocale';
import { useTableContextSelctor } from '../../hooks/useTableContext';
import { useFullscreen } from 'ahooks';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { Tooltip, TooltipProps } from 'antd';

const FullScreenSetting = (props: TooltipProps) => {
  const wrapRef = useTableContextSelctor((state) => state.wrapRef);
  const { t } = useLocale();
  const [isFullscreen, { toggleFullscreen, exitFullscreen }] = useFullscreen(wrapRef);

  return (
    <Tooltip placement="top" title={t('component.table.settingFullScreen')} {...props}>
      {!isFullscreen && <FullscreenOutlined onClick={toggleFullscreen} />}
      {isFullscreen && <FullscreenExitOutlined onClick={exitFullscreen} />}
    </Tooltip>
  );
};

export default FullScreenSetting;
