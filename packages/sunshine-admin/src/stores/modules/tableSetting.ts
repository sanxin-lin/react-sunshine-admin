import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { TableSetting } from '#/store';
import { Nullable } from '#/global';
import type { SizeType, ColumnOptionsType } from '@/components/Table/src/types/table';
import { Persistent } from '@/utils/cache/persistent';
import { TABLE_SETTING_KEY } from '@/enums/cacheEnum';

interface TableSettingState {
  setting: Nullable<Partial<TableSetting>>;
}

interface TableSettingGetter {
  getTableSize(): SizeType;
  getShowIndexColumn(routeName: string): boolean;
  getShowRowSelection(routeName: string): boolean;
  getColumns(routeName: string): Nullable<ColumnOptionsType[]>;
}

interface TableSettingAction {
  setTableSetting(setting: Partial<TableSetting>): void;
  resetTableSetting(): void;
  setTableSize(size: SizeType): void;
  setShowIndexColumn(routeName: string, show: boolean): void;
  setShowRowSelection(routeName: string, show: boolean): void;
  setColumns(routeName: string, columns: ColumnOptionsType[]): void;
  clearColumns(routeName: string): void;
}

type TableSettingStore = TableSettingState & TableSettingGetter & TableSettingAction;

export const useTableSettingStore = create<TableSettingStore>((set, get) => ({
  setting: Persistent.getLocal(TABLE_SETTING_KEY),

  getTableSize() {
    return get().setting?.size ?? 'middle';
  },
  getShowIndexColumn(routeName) {
    return get().setting?.showIndexColumn?.[routeName];
  },
  getShowRowSelection(routeName) {
    return get().setting?.showRowSelection?.[routeName];
  },
  getColumns(routeName) {
    return get().setting?.columns && get().setting?.columns[routeName]
      ? get().setting?.columns[routeName]
      : null;
  },

  setTableSetting(setting) {
    const _setting = Object.assign({}, get().setting, setting);
    set({ setting: _setting });
    Persistent.setLocal(TABLE_SETTING_KEY, _setting, true);
  },
  resetTableSetting() {
    Persistent.removeLocal(TABLE_SETTING_KEY, true);
    set({ setting: null });
  },
  setTableSize(size) {
    get().setTableSetting({ size });
  },
  setShowIndexColumn(routeName, show) {
    const { setting, setTableSetting } = get();
    setTableSetting({
      showIndexColumn: {
        ...(setting?.showIndexColumn ?? {}),
        [routeName]: show,
      },
    });
  },
  setShowRowSelection(routeName, show) {
    const { setting, setTableSetting } = get();
    setTableSetting({
      showRowSelection: {
        ...(setting?.showRowSelection ?? {}),
        [routeName]: show,
      },
    });
  },
  setColumns(routeName, columns) {
    const { setting, setTableSetting } = get();
    setTableSetting({
      columns: {
        ...(setting?.columns ?? {}),
        [routeName]: columns,
      },
    });
  },
  clearColumns(routeName) {
    const { setting, setTableSetting } = get();
    setTableSetting({
      columns: {
        ...(setting?.columns ?? {}),
        [routeName]: undefined,
      },
    });
  },
}));

export const useTableSettingStoreActions = () => {
  return useTableSettingStore(
    useShallow((state) => ({
      setTableSetting: state.setTableSetting,
      resetTableSetting: state.resetTableSetting,
      setTableSize: state.setTableSize,
      setShowIndexColumn: state.setShowIndexColumn,
      setShowRowSelection: state.setShowRowSelection,
      setColumns: state.setColumns,
      clearColumns: state.clearColumns,
    })),
  );
};
