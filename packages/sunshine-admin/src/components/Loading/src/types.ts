import { ThemeEnum } from '@/enums/appEnum';
import { SizeEnum } from '@/enums/sizeEnum';
import { SpinProps } from 'antd';

export interface LoadingProps extends SpinProps {
  tip?: string;
  size?: SizeEnum;
  absolute?: boolean;
  loading?: boolean;
  background?: string;
  theme?: ThemeEnum;
}
