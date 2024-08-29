import {
  Input,
  Select,
  Checkbox,
  InputNumber,
  Switch,
  DatePicker,
  TimePicker,
  AutoComplete,
  Radio,
} from 'antd';
import type { ComponentType } from './types/componentType';
import {
  ApiSelect,
  //   TODO ApiTreeSelect
  // ApiTreeSelect,
  RadioButtonGroup,
  //   TODO ApiRadioGroup
  // ApiRadioGroup
} from '@/components/Form';
import { Component } from 'react';

const componentMap = new Map<ComponentType, any>();

componentMap.set('Input', Input);
componentMap.set('InputNumber', InputNumber);
componentMap.set('Select', Select);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('AutoComplete', AutoComplete);
// componentMap.set('ApiTreeSelect', ApiTreeSelect);
componentMap.set('Switch', Switch);
componentMap.set('Checkbox', Checkbox);
componentMap.set('DatePicker', DatePicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
// componentMap.set('ApiRadioGroup', ApiRadioGroup);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
