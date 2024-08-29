import { Icon } from '@/components/Icon';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { triggerWindowResize } from '@/utils/dom';

const FoldButton = () => {
  const { prefixCls } = useDesign('multiple-tabs-content');
  const { show: showMenu, setMenuSetting } = useMenuSetting();
  const { show: showHeader, setHeaderSetting } = useHeaderSetting();

  const isUnFold = !showMenu && !showHeader;

  const icon = isUnFold ? 'codicon:screen-normal' : 'codicon:screen-full';

  const handleFold = () => {
    setMenuSetting({
      show: isUnFold,
      hidden: !isUnFold,
    });
    setHeaderSetting({ show: isUnFold });
    triggerWindowResize();
  };

  return (
    <span className={`${prefixCls}__extra-fold`} onClick={handleFold}>
      <Icon icon={icon} />
    </span>
  );
};

export default FoldButton;
