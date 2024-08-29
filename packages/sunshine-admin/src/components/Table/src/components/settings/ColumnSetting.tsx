import type {
  BasicColumn,
  ColumnOptionsType,
  ColumnChangeParam,
  TableRowSelection,
} from '../../types/table';
import { Tooltip, Popover, Checkbox, Divider, Button } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { SettingOutlined, DragOutlined } from '@ant-design/icons';
import { Icon } from '@/components/Icon';
import { ScrollContainer } from '@/components/Container';
import { useLocale } from '@/hooks/web/useLocale';
import { useTableContextSelctor } from '../../hooks/useTableContext';
import { useDesign } from '@/hooks/web/useDesign';
import { isNil, cloneDeep, omit, isString } from 'lodash-es';
import { getPopupContainer as getPopupContainerFn, nextTick } from '@/utils/dom';
import Sortablejs from 'sortablejs';
import { INDEX_COLUMN_FLAG } from '../../const';
import './ColumnSetting.less';
import { Nullable, Recordable } from '#/global';
import { useEffect, useRef, useState } from 'react';
import { useCreation, useMount } from 'ahooks';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import classNames from 'classnames';
import { useGetState } from '@/hooks/utils/useGetState';

interface IProps {
  getPopupContainer?: (node?: HTMLElement) => HTMLElement;
  onColumnsChange?: (columns: ColumnChangeParam[]) => void;
}

const ColumnSetting = (props: IProps) => {
  const { getPopupContainer = getPopupContainerFn, onColumnsChange } = props;
  const { t } = useLocale();
  const { prefixCls } = useDesign('basic-column-setting');

  const tableContext = useTableContextSelctor((state) => state);

  // 默认值
  const defaultIsIndexColumnShow = useRef(false);
  const defaultIsRowSelectionShow = useRef(false);
  const defaultRowSelection = useRef<Nullable<TableRowSelection<Recordable<any>>>>(null);
  const defaultColumnOptions = useRef<ColumnOptionsType[]>([]);

  // 是否已经初始化
  const isInit = useRef(false);
  const isInnerChange = useRef(false);

  // 列可选项
  const [columnOptions, setColumnOptions, getColumnOptions] = useGetState<ColumnOptionsType[]>([]);
  const columnOptionsRef = useRef(null);

  // 已选列
  const [columnCheckedOptions, setColumnCheckedOptions] = useState<string[]>([]);

  useEffect(() => {
    // 初始化后生效
    if (isInit.current) {
      // 显示
      columnOptions
        .filter((o) => columnCheckedOptions.includes(o.value))
        .forEach((o) => {
          o.column.defaultHidden = false;
        });
      // 隐藏
      columnOptions
        .filter((o) => !columnCheckedOptions.includes(o.value))
        .forEach((o) => {
          o.column.defaultHidden = true;
          o.fixed = undefined;
        });

      setColumnOptions([...columnOptions]);
      // 从 列可选项 更新 全选状态
      isColumnAllSelectedUpdate();

      // 列表列更新
      tableColumnsUpdate();
    }
  }, [columnCheckedOptions]);

  // 全选
  const [isColumnAllSelected, setIsColumnAllSelected] = useState<boolean>(false);
  const onColumnAllSelectChange = (e: CheckboxChangeEvent) => {
    setIsColumnAllSelected(e.target.checked);
    if (columnCheckedOptions.length < columnOptions.length) {
      setColumnCheckedOptions(columnOptions.map((o) => o.value));
    } else {
      setColumnCheckedOptions([]);
    }
  };
  const onCheckBoxGroupChange: CheckboxGroupProps['onChange'] = (e) => {
    setColumnCheckedOptions(e as string[]);
  };

  // 半选状态
  const indeterminate = useCreation(() => {
    return columnCheckedOptions.length > 0 && columnCheckedOptions.length < columnOptions.length;
  }, [columnCheckedOptions, columnOptions]);

  // 是否显示序号列
  const [isIndexColumnShow, setIsIndexColumnShow, getIsIndexColumnShow] =
    useGetState<boolean>(false);
  // 序号列更新
  const onIndexColumnShowChange = (e: CheckboxChangeEvent) => {
    // 更新 showIndexColumn
    showIndexColumnUpdate(e.target.checked);
  };

  // 是否显示选择列
  const [isRowSelectionShow, setIsRowSelectionShow, getIsRowSelectionShow] =
    useGetState<boolean>(false);
  // 选择列更新
  const onRowSelectionShowChange = (e: CheckboxChangeEvent) => {
    // 更新 showRowSelection
    showRowSelectionUpdate(e.target.checked);
  };

  // 重置
  const onReset = () => {
    // 重置默认值
    setIsIndexColumnShow(defaultIsIndexColumnShow.current);
    // 序号列更新
    onIndexColumnShowChange({
      target: { checked: defaultIsIndexColumnShow.current },
    } as CheckboxChangeEvent);
    // 重置默认值
    setIsRowSelectionShow(defaultIsRowSelectionShow.current);
    // 选择列更新
    onRowSelectionShowChange({
      target: { checked: defaultIsRowSelectionShow.current },
    } as CheckboxChangeEvent);
    // 重置默认值
    setColumnOptions(cloneDeep(defaultColumnOptions.current));
    // 更新表单状态
    formUpdate();
  };

  // 设置列的 fixed
  const onColumnFixedChange = (option: ColumnOptionsType, type: 'left' | 'right') => {
    if (type === 'left') {
      if (!option.fixed || option.fixed === 'right') {
        option.fixed = 'left';
      } else {
        option.fixed = undefined;
      }
    } else if (type === 'right') {
      if (!option.fixed || option.fixed === 'left') {
        option.fixed = 'right';
      } else {
        option.fixed = undefined;
      }
    }

    // 列表列更新
    tableColumnsUpdate();
  };

  // 沿用逻辑
  const sortableFix = async () => {
    // Sortablejs存在bug，不知道在哪个步骤中会向el append了一个childNode，因此这里先清空childNode
    // 有可能复现上述问题的操作：拖拽一个元素，快速的上下移动，最后放到最后的位置中松手
    if (columnOptionsRef.current) {
      const el = columnOptionsRef.current as any;
      Array.from(el.children).forEach((item) => el.removeChild(item));
    }
    await nextTick();
  };

  // 列是否显示逻辑
  const columnIfShow = (column?: Partial<Omit<BasicColumn, 'children'>>) => {
    if (column) {
      if ('ifShow' in column) {
        if (typeof column.ifShow === 'boolean') {
          return column.ifShow;
        } else if (column.ifShow) {
          return column.ifShow(column);
        }
      }
      return true;
    }
    return false;
  };

  // 获取数据列
  const getTableColumns = () => {
    return tableContext
      .getColumns({ ignoreIndex: true, ignoreAction: true })
      .filter((col) => columnIfShow(col));
  };

  // 设置列表列
  const tableColumnsSet = (columns: BasicColumn[]) => {
    isInnerChange.current = true;
    tableContext?.setColumns(columns);

    // 沿用逻辑
    const columnChangeParams: ColumnChangeParam[] = columns.map((col) => ({
      dataIndex: col.dataIndex ? col.dataIndex.toString() : '',
      fixed: col.fixed,
      visible: !col.defaultHidden,
    }));
    onColumnsChange?.(columnChangeParams);
  };

  // 列表列更新
  const tableColumnsUpdate = () => {
    // 考虑了所有列
    const columns = cloneDeep(tableContext.getColumns());

    // 从左 fixed 最一列开始排序（除了 序号列）
    let count = columns.filter(
      (o) => o.flag !== INDEX_COLUMN_FLAG && (o.fixed === 'left' || o.fixed === true),
    ).length;

    // 序号列提前
    if (isIndexColumnShow) {
      count++;
    }

    // 按 columnOptions 的排序 调整 table.getColumns() 的顺序和值
    for (const option of columnOptions) {
      const colIdx = columns.findIndex((o) => o.dataIndex === option.value);
      //
      if (colIdx > -1) {
        const target = columns[colIdx];
        target.defaultHidden = option.column?.defaultHidden;
        target.fixed = option.fixed;
        columns.splice(colIdx, 1);
        columns.splice(count++, 0, target); // 递增插入
      }
    }

    // 是否存在 action
    const actionIndex = columns.findIndex((o) => o.dataIndex === 'action');
    if (actionIndex > -1) {
      const actionCol = columns.splice(actionIndex, 1);
      columns.push(actionCol[0]);
    }

    // 设置列表列
    tableColumnsSet(columns);
  };

  // 打开浮窗
  const onOpenChange = async () => {
    await nextTick();

    if (columnOptionsRef.current) {
      // 注册排序实例
      const el = columnOptionsRef.current;
      Sortablejs.create(el, {
        animation: 500,
        delay: 400,
        delayOnTouchOnly: true,
        handle: '.table-column-drag-icon ',
        dataIdAttr: 'data-no',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          if (isNil(oldIndex) || isNil(newIndex) || oldIndex === newIndex) {
            return;
          }

          const options = cloneDeep(columnOptions);

          // 排序
          if (oldIndex > newIndex) {
            options.splice(newIndex, 0, options[oldIndex]);
            options.splice(oldIndex + 1, 1);
          } else {
            options.splice(newIndex + 1, 0, options[oldIndex]);
            options.splice(oldIndex, 1);
          }

          // 更新 列可选项
          setColumnOptions(options);

          // 列表列更新
          tableColumnsUpdate();
        },
      });
    }
  };
  // 从 列可选项 更新 已选列
  const columnCheckedOptionsUpdate = (options?: ColumnOptionsType[]) => {
    setColumnCheckedOptions(
      (options ?? columnOptions).filter((o) => !o.column?.defaultHidden).map((o) => o.value),
    );
  };
  // 从 列可选项 更新 全选状态
  const isColumnAllSelectedUpdate = (options?: ColumnOptionsType[]) => {
    nextTick(() => {
      setIsColumnAllSelected((options ?? columnOptions).length === columnCheckedOptions.length);
    });
  };
  // 更新 showIndexColumn
  const showIndexColumnUpdate = (showIndexColumn: boolean) => {
    isInnerChange.current = true;
    tableContext.setProps({
      showIndexColumn,
    });
  };
  // 更新 rowSelection
  const showRowSelectionUpdate = (showRowSelection) => {
    isInnerChange.current = true;
    tableContext.setProps({
      rowSelection: showRowSelection
        ? {
            ...omit(defaultRowSelection, ['selectedRowKeys']),
            fixed: true,
          }
        : undefined,
    });
  };

  // 更新表单状态
  const formUpdate = () => {
    // 从 列可选项 更新 已选列
    columnCheckedOptionsUpdate(getColumnOptions());

    // 从 列可选项 更新 全选状态
    isColumnAllSelectedUpdate(getColumnOptions());

    // 更新 showIndexColumn
    showIndexColumnUpdate(getIsIndexColumnShow());

    // 更新 showRowSelection
    showRowSelectionUpdate(getIsRowSelectionShow());

    // 列表列更新
    tableColumnsUpdate();
  };

  const init = async () => {
    if (!isInit.current) {
      // 获取数据列
      const columns = getTableColumns();

      // 沿用逻辑
      tableContext.setCacheColumns?.(columns);

      // 生成 默认值
      const options: ColumnOptionsType[] = [];
      for (const col of columns) {
        // 只缓存 string 类型的列
        options.push({
          label: isString(col.title)
            ? col.title
            : col.customTitle === 'string'
              ? col.customTitle
              : '',
          value: isString(col.dataIndex) ? col.dataIndex : col.title === 'string' ? col.title : '',
          column: {
            defaultHidden: col.defaultHidden,
          },
          fixed: col.fixed,
        });
      }
      // 默认值 缓存
      defaultIsIndexColumnShow.current = tableContext.allProps.showIndexColumn || false;
      defaultRowSelection.current = tableContext.getRowSelection();
      defaultIsRowSelectionShow.current = !!defaultRowSelection.current; // 设置了 rowSelection 才出现
      defaultColumnOptions.current = options;

      // 默认值 赋值
      setIsIndexColumnShow(defaultIsIndexColumnShow.current);
      setIsRowSelectionShow(defaultIsRowSelectionShow.current);
      setColumnOptions(cloneDeep(options));
      // 更新表单状态
      formUpdate();

      isInit.current = true;
    }
  };
  // 初始化
  const once = async () => {
    // 仅执行一次
    await sortableFix();
    init();
  };

  useMount(() => {
    once();
  });
  return (
    <Tooltip placement="top" title={t('component.table.settingColumn')}>
      <Popover
        placement="bottomLeft"
        trigger="click"
        onOpenChange={onOpenChange}
        overlayClassName={`${prefixCls}__column-list`}
        getPopupContainer={getPopupContainer}
        title={
          <div className={`${prefixCls}__popover-title`}>
            <Checkbox
              indeterminate={indeterminate}
              defaultChecked={isColumnAllSelected}
              checked={isColumnAllSelected}
              onChange={onColumnAllSelectChange}
            >
              {t('component.table.settingColumnShow')}
            </Checkbox>
            <Checkbox
              defaultChecked={isIndexColumnShow}
              checked={isIndexColumnShow}
              onChange={onIndexColumnShowChange}
            >
              {t('component.table.settingIndexColumnShow')}
            </Checkbox>
            {defaultIsRowSelectionShow.current && (
              <Checkbox checked={isRowSelectionShow} onChange={onRowSelectionShowChange}>
                {t('component.table.settingSelectColumnShow')}
              </Checkbox>
            )}
            <Button size="small" type="link" onClick={onReset}>
              {t('common.resetText')}
            </Button>
          </div>
        }
        content={
          <ScrollContainer>
            <Checkbox.Group
              ref={columnOptionsRef}
              defaultValue={columnCheckedOptions}
              value={columnCheckedOptions}
              onChange={onCheckBoxGroupChange}
            >
              {columnOptions.map((option, index) => (
                <div key={index} className={`${prefixCls}__check-item`} data-no={option.value}>
                  <DragOutlined className="table-column-drag-icon" />
                  <Checkbox value={option.value}>{option.label}</Checkbox>
                  <Tooltip
                    placement="bottomLeft"
                    mouseLeaveDelay={0.4}
                    getPopupContainer={getPopupContainer}
                    title={t('component.table.settingFixedLeft')}
                  >
                    <Icon
                      icon="line-md:arrow-align-left"
                      className={classNames(`${prefixCls}__fixed-left`, {
                        active: option.fixed === 'left',
                        disabled: option.value
                          ? !columnCheckedOptions.includes(option.value as string)
                          : true,
                      })}
                      onClick={() => onColumnFixedChange(option, 'left')}
                    />
                  </Tooltip>
                  <Divider type="vertical" />
                  <Tooltip
                    placement="bottomLeft"
                    mouseLeaveDelay={0.4}
                    getPopupContainer={getPopupContainer}
                    title={t('component.table.settingFixedRight')}
                  >
                    <Icon
                      icon="line-md:arrow-align-left"
                      className={classNames(`${prefixCls}__fixed-right`, {
                        active: option.fixed === 'right',
                        disabled: option.value
                          ? !columnCheckedOptions.includes(option.value as string)
                          : true,
                      })}
                      onClick={() => onColumnFixedChange(option, 'right')}
                    />
                  </Tooltip>
                </div>
              ))}
            </Checkbox.Group>
          </ScrollContainer>
        }
      >
        <SettingOutlined />
      </Popover>
    </Tooltip>
  );
};

export default ColumnSetting;
