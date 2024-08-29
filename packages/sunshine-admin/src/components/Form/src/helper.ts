import { isNumber } from 'lodash-es';

import type { ComponentType } from './types';

export const DEFAULT_VALUE_COMPONENTS = [
  'Input',
  'InputPassword',
  'InputNumber',
  'InputSearch',
  'InputTextArea',
];

export const DATE_TYPE_COMPONENTS = [
  'DatePicker',
  'MonthPicker',
  'WeekPicker',
  'TimePicker',
  'RangePicker',
];

// TODO 自定义组件封装会出现验证问题，因此这里目前改成手动触发验证
export const NO_AUTO_LINK_COMPONENTS: ComponentType[] = [
  'Upload',
  'ApiTransfer',
  'ApiTree',
  'ApiTreeSelect',
  'ApiRadioGroup',
  'ApiCascader',
  'AutoComplete',
  'RadioButtonGroup',
  'ImageUpload',
  'ApiSelect',
];

export const SIMPLE_COMPONENTS = ['Divider', 'BasicTitle'];

export function isIncludeSimpleComponents(component?: ComponentType) {
  return SIMPLE_COMPONENTS.includes(component || '');
}

export function handleInputNumberValue(component?: ComponentType, val?: any) {
  if (!component) return val;
  if (DEFAULT_VALUE_COMPONENTS.includes(component)) {
    return val && isNumber(val) ? val : `${val}`;
  }
  return val;
}
