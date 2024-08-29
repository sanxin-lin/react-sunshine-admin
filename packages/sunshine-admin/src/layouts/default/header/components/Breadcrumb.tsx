import { Breadcrumb, BreadcrumbItem, Menu, MenuItem } from 'antd';
import { isString } from 'lodash-es';

import { Icon } from '@/components/Icon';
import { ThemeEnum } from '@/enums/appEnum';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useGo } from '@/hooks/web/usePage';
import { REDIRECT_ROUTE_ID } from '@/router/constants';

import './Breadcrumb.less';

interface IProps {
  theme?: ThemeEnum;
}

const BreadcrumbComp = (props: IProps) => {
  const { theme } = props;
  const { prefixCls } = useDesign('layout-breadcrumb');
  const { getShowBreadCrumbIcon } = useRootSetting();
  const go = useGo();

  const { t } = useLocale();

  return <div>22</div>;
};

export default BreadcrumbComp;
