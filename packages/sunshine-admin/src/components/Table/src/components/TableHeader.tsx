import './TableHeader.less';
import type { ColumnChangeParam, TableHeaderProps } from '../types/table';
import { Divider } from 'antd';
import Setting from './settings/Index';
import TableTitle from './TableTitle';
import { useDesign } from '@/hooks/web/useDesign';
import TableSelectionBar from '../components/TableSelectionBar';

const TableHeader = (props: TableHeaderProps) => {
  const {
    title,
    tableSetting,
    showTableSetting,
    titleHelpMessage = '',
    clearSelectedRowKeys,
    count = 0,
    showSelectionBar = false,
    onColumnsChange,

    headerTop,
    tableTitle,
    toolbar,
  } = props;

  const { prefixCls } = useDesign('basic-table-header');
  const handleColumnChange = (data: ColumnChangeParam[]) => {
    onColumnsChange?.(data);
  };

  return (
    <div className="w-full">
      {headerTop && <div style={{ margin: '5px' }}>{headerTop}</div>}
      {showSelectionBar && (
        <div style={{ margin: '5px' }}>
          <TableSelectionBar clearSelectedRowKeys={clearSelectedRowKeys} count={count} />
        </div>
      )}
      <div className="flex items-center">
        {tableTitle}
        {!tableTitle && title && <TableTitle helpMessage={titleHelpMessage} title={title} />}
        <div className={`${prefixCls}__toolbar`}>
          {toolbar}
          {toolbar && showTableSetting && <Divider type="vertical" />}
          {showTableSetting && (
            <Setting setting={tableSetting} onColumnsChange={handleColumnChange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
