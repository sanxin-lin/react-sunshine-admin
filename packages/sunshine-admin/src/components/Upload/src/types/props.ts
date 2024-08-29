import { FileBasicColumn, FileItem } from './index';

import type { Options } from 'sortablejs';

import { BasicColumn } from '@/components/Table';
import { Merge, PromiseFn, Recordable } from '#/global';

type SortableOptions = Merge<
  Omit<Options, 'onEnd'>,
  {
    onAfterEnd?: <T = any, R = any>(params: T) => R;
    // ...可扩展
  }
>;
type previewColumnsFnType = {
  handleRemove: (record: Record<string, any>, key: string) => any;
  handleAdd: (record: Record<string, any>, key: string) => any;
};

export interface PreviewType {
  previewColumns?: BasicColumn[] | ((arg: previewColumnsFnType) => BasicColumn[]);
  beforePreviewData?: (arg: string[]) => Recordable<any>;
  previewFileList?: string[];
}

type ListType = 'text' | 'picture' | 'picture-card';

export interface BasicUploadProps extends PreviewType {
  disabled?: boolean;
  listType?: ListType;
  helpText?: string;
  maxSize?: number;
  maxNumber?: number;
  accept?: string[];
  multiple?: boolean;
  uploadParams?: any;
  api: PromiseFn;
  name?: string;
  filename?: string;
  fileListOpenDrag?: boolean;
  fileListDragOptions?: SortableOptions;
  resultField?: string;
  onDelete?: (record: FileItem) => void;
  onChange?: (fileList: string[]) => void;
}

export interface UploadContainerProps extends BasicUploadProps {
  value?: string[];
  showPreviewNumber?: boolean;
  emptyHidePreview?: boolean;
}

export interface PreviewProps extends PreviewType {
  value?: string[];
  maxNumber?: number;
}

export interface FileListProps {
  columns?: BasicColumn[] | FileBasicColumn[];
  actionColumn?: FileBasicColumn;
  dataSource?: any[];
  openDrag?: boolean;
  dragOptions?: SortableOptions;
  onDataSourceChange?: (dataSource: any[]) => void;
}
