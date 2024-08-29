import { useState } from 'react';
import { getBasicColumns, getBasicData } from './tableData';
import { BasicTable, ColumnChangeParam, PaginationProps } from '@/components/Table';
import { Button } from 'antd';

const BasicExample = () => {
  const [canResize, setCanResize] = useState(false);
  const [loading, setLoading] = useState(false);
  const [striped, setStriped] = useState(true);
  const [border, setBorder] = useState(true);
  const [pagination, setPagination] = useState<PaginationProps | boolean>(false);

  const columns = getBasicColumns();
  const data = getBasicData();

  const toggleCanResize = () => {
    setCanResize((pre) => !pre);
  };
  const toggleStriped = () => {
    setStriped((pre) => !pre);
  };
  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPagination({ pageSize: 20 });
    }, 3000);
  };
  const toggleBorder = () => {
    setBorder((pre) => !pre);
  };

  const handleColumnChange = (data: ColumnChangeParam[]) => {
    // console.log('ColumnChanged', data);
  };

  return (
    <div className="p-4">
      <BasicTable
        title="基础示例"
        titleHelpMessage="温馨提醒"
        columns={columns}
        dataSource={data}
        canResize={canResize}
        loading={loading}
        striped={striped}
        bordered={border}
        showTableSetting
        pagination={pagination}
        onColumnsChange={handleColumnChange}
        toolbar={
          <>
            <Button type="primary" onClick={toggleCanResize}>
              {!canResize ? '自适应高度' : '取消自适应'}
            </Button>
            <Button type="primary" onClick={toggleBorder}>
              {!border ? '显示边框' : '隐藏边框'}
            </Button>
            <Button type="primary" onClick={toggleLoading}>
              开启loading
            </Button>
            <Button type="primary" onClick={toggleStriped}>
              {!striped ? '显示斑马纹' : '隐藏斑马纹'}
            </Button>
          </>
        }
      />
    </div>
  );
};

export default BasicExample;
