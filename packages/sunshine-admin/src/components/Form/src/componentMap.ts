import {
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from 'antd';

import type { ComponentType } from './types';

export const componentMap: {
  [K in ComponentType]: any;
} = {
  Input,
  InputPassword: Input.Password,
  InputSearch: Input.Search,
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  TimePicker: DatePicker.TimePicker,
  WeekPicker: DatePicker.WeekPicker,
  MonthPicker: DatePicker.MonthPicker,
  Divider,
  InputNumber,
  Radio,
  Rate,
  Select,
  Switch,
  Slider,
  Transfer,
  TreeSelect,
  TimeRangePicker: TimePicker.RangePicker,
  Upload,
};

export const add = (compName: any, component: any) => {
  componentMap[compName] = component;
};

export function del(compName: any) {
  delete componentMap[compName];
}
