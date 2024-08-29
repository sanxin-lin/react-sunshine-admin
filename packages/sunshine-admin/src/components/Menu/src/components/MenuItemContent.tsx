import { Icon } from '@/components/Icon';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';

import { BaseProps } from '#/compoments';
import { Menu } from '#/router';

interface IProps extends BaseProps {
  item?: Menu;
  //   showTitle?: boolean;
  //   level: number;
  //   isHorizontal?: boolean;
}

const MenuItemContent: React.FC<IProps> = (props) => {
  const { item, className, ...wrapperProps } = props;
  const { t } = useLocale();
  const { prefixCls } = useDesign('basic-menu-item-content');

  const i18nName = t(item?.handle?.title || item?.name);
  const icon = item?.img ? undefined : item?.icon;
  const img = item?.img;

  return (
    <span {...wrapperProps} className={`${className} flex items-center`}>
      {img && <img src={img} className="w-18px h-18px align-top mr-2"></img>}
      {icon && <Icon icon={icon} size="18" className={`${prefixCls}-wrapper__icon mr-2`} />}
      {i18nName}
    </span>
  );
};

export default MenuItemContent;
