import { useTableContextSelctor } from '../../hooks/useTableContext';
import { Tooltip, TooltipProps } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { useLocale } from '@/hooks/web/useLocale';

const RedoSetting = (props: TooltipProps) => {
  const reload = useTableContextSelctor((state) => state.reload);
  const { t } = useLocale();

  return (
    <Tooltip placement="top" title={t('common.redo')} {...props}>
      <RedoOutlined
        onClick={() => {
          reload();
        }}
      />
    </Tooltip>
  );
};

export default RedoSetting;
