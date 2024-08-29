import { componentMap } from '@/components/Table/src/componentMap';
import { EditableCellComponentProps } from '../../types/table';
import { useCreation } from 'ahooks';
import { Popover } from 'antd';

const CellComponent = (props: EditableCellComponentProps) => {
  const {
    component = 'Input',
    rule,
    ruleMessage,
    popoverVisible,
    getPopupContainer,
    ...restProps
  } = props;

  const Comp = useCreation(() => {
    return componentMap.get(component);
  }, [component]);

  if (!rule) return <Comp {...restProps} />;

  return (
    <Popover
      overlayClassName="edit-cell-rule-popover"
      open={!!popoverVisible}
      {...(getPopupContainer ? { getPopupContainer } : {})}
      content={ruleMessage}
    >
      <Comp {...restProps} />
    </Popover>
  );
};

export default CellComponent;
