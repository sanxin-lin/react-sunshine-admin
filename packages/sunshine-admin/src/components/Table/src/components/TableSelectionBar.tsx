import { useDesign } from '@/hooks/web/useDesign';
import { TableActionType } from '../types/table';
import './TableSelectionBar.less';
import { useLocale } from '@/hooks/web/useLocale';
import { Alert, Button } from 'antd';

interface IProps {
  count?: number;
  clearSelectedRowKeys?: TableActionType['clearSelectedRowKeys'];
}

const TableSelectionBar = (props: IProps) => {
  const { count = 0, clearSelectedRowKeys } = props;
  const { prefixCls } = useDesign('table-select-bar');
  const { t } = useLocale();

  return (
    <Alert
      type="info"
      showIcon
      className={prefixCls}
      message={
        <>
          {count > 0 && (
            <span>{t('component.table.selectionBarTips', { count: props.count })}</span>
          )}
          {count <= 0 && <span>{t('component.table.selectionBarEmpty')}</span>}
          {count > 0 && (
            <Button onClick={clearSelectedRowKeys} size="small">
              {t('component.table.selectionBarClear')}
            </Button>
          )}
        </>
      }
    ></Alert>
  );
};

export default TableSelectionBar;
