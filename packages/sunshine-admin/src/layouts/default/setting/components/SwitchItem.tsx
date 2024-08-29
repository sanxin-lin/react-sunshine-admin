import { useCreation } from 'ahooks';
import { Switch, SwitchProps } from 'antd';

import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';

import { HandlerEnum } from '../enum';
import { useSettingsHandler } from '../handler';

import './SwitchItem.less';

interface IProps {
  event: HandlerEnum;
  disabled?: boolean;
  title: string;
  def?: boolean;
}

const SwitchItem = (props: IProps) => {
  const { event, disabled, title, def } = props;
  const { handleSettings } = useSettingsHandler();
  const { prefixCls } = useDesign('setting-switch-item');
  const { t } = useLocale();
  const switchProps = useCreation(() => {
    return def ? { checked: def } : {};
  }, [def]);
  const handleChange: SwitchProps['onChange'] = (val) => {
    event && handleSettings(props.event, val);
  };

  return (
    <div className={prefixCls}>
      <span> {title}</span>
      <Switch
        {...switchProps}
        onChange={handleChange}
        disabled={disabled}
        checkedChildren={t('layout.setting.on')}
        unCheckedChildren={t('layout.setting.off')}
      />
    </div>
  );
};

export default SwitchItem;
