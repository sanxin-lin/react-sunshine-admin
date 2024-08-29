import { Badge, Tooltip } from 'antd';

import { Icon } from '@/components/Icon';
import { PageEnum } from '@/enums/pageEnum';
import { useLocale } from '@/hooks/web/useLocale';
import { useGo } from '@/hooks/web/usePage';
import { useErrorLogStore, useErrorLogStoreActions } from '@/stores/modules/errorLog';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const ErrorAction = (props: IProps) => {
  const { className } = props;

  const { t } = useLocale();
  const go = useGo();
  const errorLogListCount = useErrorLogStore((state) => state.getErrorLogListCount());
  const { setErrorLogListCount } = useErrorLogStoreActions();

  const handleToErrorList = () => {
    go(PageEnum.ERROR_LOG_PAGE);
    setErrorLogListCount(0);
  };

  return (
    <Tooltip
      className={className}
      title={t('layout.header.tooltipErrorLog')}
      placement="bottom"
      mouseEnterDelay={0.5}
    >
      <Badge count={errorLogListCount} offset={[0, 10]} overflowCount={99}>
        <Icon icon="ion:bug-outline" onClick={handleToErrorList} />
      </Badge>
    </Tooltip>
  );
};

export default ErrorAction;
