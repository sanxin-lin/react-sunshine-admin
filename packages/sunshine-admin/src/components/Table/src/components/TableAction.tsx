import './TableAction.less';
import { MoreOutlined } from '@ant-design/icons';
import { Divider, Tooltip, TooltipProps, Popconfirm, Button } from 'antd';
import { Icon } from '@/components/Icon';
import type { TableActionProps } from '../types/table';
import type { ActionItem } from '../types/tableAction';
import { Dropdown } from '@/components/Dropdown';
import { useDesign } from '@/hooks/web/useDesign';
import { useTableContextSelctor } from '../hooks/useTableContext';
import { usePermission } from '@/hooks/web/usePermission';
import { isBoolean, isFunction, isString } from 'lodash-es';
import { ACTION_COLUMN_FLAG } from '../const';
import { useCreation } from 'ahooks';
import classNames from 'classnames';

const TableAction = (props: TableActionProps) => {
  const {
    actions = null,
    dropDownActions = null,
    divider = true,
    // outside,
    stopButtonPropagation = false,
    more,
  } = props;

  const { prefixCls } = useDesign('basic-table-action');
  const { hasPermission } = usePermission();
  const { wrapRef, getColumns } = useTableContextSelctor((state) => ({
    wrapRef: state.wrapRef,
    getColumns: state.getColumns,
  }));

  const getIfShow = (action: ActionItem): boolean => {
    const ifShow = action.ifShow;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(action);
    }
    return isIfShow;
  };

  const currentActions = useCreation(() => {
    return (actions || [])
      .filter((action) => {
        return hasPermission(action.auth) && getIfShow(action);
      })
      .map((action) => {
        const { popConfirm } = action;
        return {
          getPopupContainer: () => wrapRef.current ?? document.body,
          type: 'link',
          size: 'small',
          ...action,
          ...(popConfirm || {}),
          onConfirm: popConfirm?.confirm,
          onCancel: popConfirm?.cancel,
          enable: !!popConfirm,
        };
      });
  }, [actions]);

  const currentDropdownList = useCreation((): any[] => {
    const list = (dropDownActions || []).filter((action) => {
      return hasPermission(action.auth) && getIfShow(action);
    });
    return list.map((action, index) => {
      const { label, popConfirm } = action;
      return {
        ...action,
        ...popConfirm,
        onConfirm: popConfirm?.confirm,
        onCancel: popConfirm?.cancel,
        text: label,
        divider: index < list.length - 1 ? divider : false,
      };
    });
  }, [dropDownActions]);

  const getAlign = () => {
    const columns = getColumns?.() || [];
    const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
    return actionColumn?.align ?? 'left';
  };

  const getTooltip = (data: string | TooltipProps): TooltipProps => {
    return {
      getPopupContainer: () => wrapRef.current ?? document.body,
      placement: 'bottom',
      ...(isString(data) ? { title: data } : data),
    };
  };

  const onCellClick: any = (e: MouseEvent) => {
    if (!stopButtonPropagation) return;
    const path = e.composedPath() as HTMLElement[];
    const isInButton = path.find((ele) => {
      return ele.tagName?.toUpperCase() === 'BUTTON';
    });
    isInButton && e.stopPropagation();
  };

  return (
    <div className={`${prefixCls} ${getAlign()}`} onClick={onCellClick}>
      {actions?.map((action, index) => {
        return (
          <>
            {action.tooltip && (
              <Tooltip {...getTooltip(action.tooltip)}>
                <Popconfirm
                  okButtonProps={{
                    icon: (
                      <Icon icon={action.icon} className={classNames({ 'mr-1': !!action.label })} />
                    ),
                  }}
                  {...(action as any)}
                >
                  {action.label}
                </Popconfirm>
              </Tooltip>
            )}
            {!action.tooltip && (
              <Popconfirm
                okButtonProps={{
                  icon: (
                    <Icon icon={action.icon} className={classNames({ 'mr-1': !!action.label })} />
                  ),
                }}
                {...(action as any)}
              >
                {action.label}
              </Popconfirm>
            )}
            {action.divider && currentActions.length > 0 && (
              <Divider type="vertical" className="action-divider" />
            )}
          </>
        );
      })}
      {currentDropdownList.length > 0 && (
        <Dropdown trigger={['hover']} dropMenuList={currentDropdownList} popconfirm>
          {more}
          {!more && (
            <Button type="link" size="small">
              <MoreOutlined className="icon-more" />
            </Button>
          )}
        </Dropdown>
      )}
    </div>
  );
};

export default TableAction;
