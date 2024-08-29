import { useCreation } from 'ahooks';
import { useTableContextSelctor } from '../../hooks/useTableContext';
import { ColumnChangeParam, TableSetting } from '../../types/table';
import './Index.less';
import RedoSetting from './RedoSetting';
import SizeSetting from './SizeSetting';
import ColumnSetting from './ColumnSetting';
import FullScreenSetting from './FullScreenSetting';

interface IProps {
  setting?: TableSetting;
  onColumnsChange?: (columns: ColumnChangeParam[]) => void;
}

const Setting = (props: IProps) => {
  const { setting = {}, onColumnsChange } = props;
  const wrapRef = useTableContextSelctor((state) => state.wrapRef);
  const getSetting = useCreation((): TableSetting => {
    return {
      redo: true,
      size: true,
      setting: true,
      fullScreen: false,
      ...setting,
    };
  }, [setting]);

  const handleColumnChange = (data: ColumnChangeParam[]) => {
    onColumnsChange?.(data);
  };

  const getTableContainer = () => {
    return wrapRef.current ?? document.body;
  };

  return (
    <div className="table-settings">
      {getSetting.redo && <RedoSetting getPopupContainer={getTableContainer} />}
      {getSetting.size && <SizeSetting getPopupContainer={getTableContainer} />}
      {getSetting.setting && (
        <ColumnSetting getPopupContainer={getTableContainer} onColumnsChange={handleColumnChange} />
      )}
      {getSetting.fullScreen && <FullScreenSetting getPopupContainer={getTableContainer} />}
    </div>
  );
};

export default Setting;
