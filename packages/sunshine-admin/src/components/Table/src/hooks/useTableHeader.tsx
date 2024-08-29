import type { BasicTableProps, InnerHandlers, InnerMethods } from '../types/table';
import TableHeader from '../components/TableHeader';
import { isString } from 'lodash-es';
import { useCreation } from 'ahooks';
import { Recordable } from '#/global';

export const useTableHeader = (
  props: BasicTableProps,
  handlers: InnerHandlers,
  methods: InnerMethods,
) => {
  const {
    title,
    tableTitle,
    toolbar,
    showTableSetting,
    titleHelpMessage,
    tableSetting,
    showSelectionBar,
    headerTop,
  } = props;
  const headerPropsCreation = useCreation((): Recordable => {
    const hideTitle = !tableTitle && !title && !toolbar && !showTableSetting;
    if (hideTitle && !isString(title)) {
      return {};
    }

    return {
      title: hideTitle
        ? null
        : () => (
            <TableHeader
              title={title}
              titleHelpMessage={titleHelpMessage}
              showTableSetting={showTableSetting}
              tableSetting={tableSetting}
              onColumnsChange={handlers.onColumnsChange}
              clearSelectedRowKeys={methods.clearSelectedRowKeys}
              count={methods.getSelectRowKeys().length}
              showSelectionBar={showSelectionBar}
              toolbar={toolbar}
              tableTitle={tableTitle}
              headerTop={headerTop}
            />
          ),
    };
  }, [title, showTableSetting, titleHelpMessage, tableSetting, showSelectionBar, tableTitle]);
  return { headerProps: headerPropsCreation };
};
