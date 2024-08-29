import { Icon } from '@/components/Icon';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';

import './AppSearchFooter.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const AppSearchFooter = (props: IProps) => {
  const { className, ...wrapperProps } = props;
  const { prefixCls } = useDesign('app-search-footer');
  const { t } = useLocale();

  return (
    <div {...wrapperProps} className={`${prefixCls} ${className}`}>
      <Icon className={`${prefixCls}-item`} icon="ant-design:enter-outlined" />
      <span>{t('component.app.toSearch')}</span>
      <Icon className={`${prefixCls}-item`} icon="ion:arrow-up-outline" />
      <Icon className={`${prefixCls}-item`} icon="ion:arrow-down-outline" />
      <span>{t('component.app.toNavigate')}</span>
      <Icon className={`${prefixCls}-item`} icon="mdi:keyboard-esc" />
      <span>{t('common.closeText')}</span>
    </div>
  );
};

export default AppSearchFooter;
