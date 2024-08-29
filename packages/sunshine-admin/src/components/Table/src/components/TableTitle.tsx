import { ReactNode } from 'react';
import './TableTitle.less';
import { BasicTitle } from '@/components/Basic';
import { isNil } from 'lodash-es';
import { useDesign } from '@/hooks/web/useDesign';

interface IProps {
  title?: ReactNode;
  helpMessage?: string | string[];
}

const TableTitle = (props: IProps) => {
  const { title, helpMessage } = props;
  const { prefixCls } = useDesign('basic-table-title');
  if (isNil(title)) return null;

  return (
    <BasicTitle className={prefixCls} helpMessage={helpMessage}>
      {title}
    </BasicTitle>
  );
};

export default TableTitle;
