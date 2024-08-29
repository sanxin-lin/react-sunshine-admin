import { useDesign } from '@/hooks/web/useDesign';
import { useCreation } from 'ahooks';
import { ColumnType } from 'antd/lib/table';
import { BasicColumn } from '../types/table';
import { isFunction } from 'lodash-es';
import { BasicHelp } from '@/components/Basic';
import EditTableHeaderCell from './EditTableHeaderIcon';
import { ReactNode } from 'react';

interface IProps {
  column?: ColumnType<any>;
}

const HeaderCell = (props: IProps) => {
  const { column = {} } = props;
  const { prefixCls } = useDesign('basic-table-header-cell');
  const title = useCreation(() => {
    const _column = column as BasicColumn;
    if (isFunction(_column.customHeaderRender)) {
      return _column.customHeaderRender(_column);
    }
    return (_column?.customTitle || column?.title) as ReactNode;
  }, [column]);
  const isEdit = useCreation(() => !!(column as BasicColumn)?.edit, [column]);
  const helpMessage = useCreation(() => (column as BasicColumn)?.helpMessage, [column]);
  return (
    <div>
      {isEdit ? (
        <EditTableHeaderCell>{title}</EditTableHeaderCell>
      ) : (
        <span className="default-header-cell">{title}</span>
      )}
      {helpMessage && <BasicHelp text={helpMessage} className={`${prefixCls}__help`} />}
    </div>
  );
};

export default HeaderCell;
