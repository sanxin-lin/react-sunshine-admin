import { ThemeEnum } from '@/enums/appEnum';

import HeaderTrigger from './HeaderTrigger';
import SiderTrigger from './SiderTrigger';

interface IProps {
  sider?: boolean;
  theme?: ThemeEnum;
}

const Index = (props: IProps) => {
  const { sider = true, theme } = props;

  if (sider) return <SiderTrigger />;
  return <HeaderTrigger theme={theme} />;
};

export default Index;
