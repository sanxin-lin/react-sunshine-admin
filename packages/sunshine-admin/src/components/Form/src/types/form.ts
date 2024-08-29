import type { CSSProperties, ReactNode } from 'react';
import type { ButtonProps, RowProps } from 'antd';
import { FormInstance, FormProps as AntdFormProps } from 'antd';
import type { RuleObject } from 'antd/es/form';

import type { TableActionType } from '@/components/Table/src/types/table';

import type { ColEx, ComponentProps, ComponentType } from './';
import type { FormItem } from './formItem';

import { Recordable } from '#/global';

export type FieldMapToTime = [string, [string, string], (string | [string, string])?][];

export type Rule = RuleObject & {
  validateTrigger?: 'blur' | 'change' | ['change', 'blur'];
};

export interface RenderCallbackParams {
  schema: FormSchemaInner;
  field: string;
}

export interface FormActionType<Values extends Recordable = any> extends FormInstance<Values> {
  // $el: RefObject<HTMLElement>;
  // setFieldsValue: (values: Recordable) => Promise<void>;
  // clearValidate: (name?: string | string[]) => Promise<void>;
  updateSchemas: (data: Partial<FormSchemaInner> | Partial<FormSchemaInner>[]) => Promise<void>;
  resetSchemas: (data: Partial<FormSchemaInner> | Partial<FormSchemaInner>[]) => Promise<void>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  removeSchemaByField: (field: string | string[]) => Promise<void>;
  appendSchemaByField: (
    schema: FormSchemaInner | FormSchemaInner[],
    prefixField: string | undefined,
    first?: boolean | undefined,
  ) => Promise<void>;
  // validateFields: (nameList?: NamePath[]) => Promise<any>;
  submit: FormInstance<Values>['submit'];
  resetFields: FormInstance<Values>['resetFields'];
  getFieldsValue: FormInstance<Values>['getFieldsValue'];
  validateFields: FormInstance<Values>['validateFields'];
  // validate: <T = Recordable>(nameList?: NamePath[] | false) => Promise<T>;
  // scrollToField: (name: NamePath, options?: ScrollOptions) => void;
  scrollToField: FormInstance<Values>['scrollToField'];
}

export type RegisterFn = (formInstance: FormActionType) => void;

export type UseFormReturnType<Values extends Recordable = any> = [
  RegisterFn,
  FormActionType<Values>,
];

export interface FormActionProps {
  showActionButtonGroup?: boolean;
  showResetButton?: boolean;
  showSubmitButton?: boolean;
  showAdvancedButton?: boolean;
  // Reset button configuration
  resetButtonOptions?: Partial<ButtonProps>;

  // Confirm button configuration
  submitButtonOptions?: Partial<ButtonProps>;
  actionColOptions?: Partial<ColEx>;
  actionSpan?: number;
  isAdvanced?: boolean;
  hideAdvanceBtn?: boolean;
  resetBefore?: ReactNode;
  submitBefore?: ReactNode;
  advanceBefore?: ReactNode;
  advanceAfter?: ReactNode;
  onToggleAdvanced?: () => void;
}

export interface FormProps extends Omit<AntdFormProps, 'children'> {
  name?: string;
  layout?: 'vertical' | 'inline' | 'horizontal';
  // Form value
  // model?: Recordable;
  // The width of all items in the entire form
  labelWidth?: number | string;
  // alignment
  labelAlign?: 'left' | 'right';
  // Row configuration for the entire form
  rowProps?: RowProps;
  // Submit form on reset
  submitOnReset?: boolean;
  // Submit form on form changing
  // submitOnChange?: boolean;
  // Col configuration for the entire form
  labelCol?: Partial<ColEx>;
  // Col configuration for the entire form
  wrapperCol?: Partial<ColEx>;

  // General row style
  baseRowStyle?: CSSProperties;

  // General col configuration
  baseColProps?: Partial<ColEx>;

  // Form configuration rules
  schemas?: FormSchema[];
  // Function values used to merge into dynamic control form items
  mergeDynamicData?: Recordable;
  // Compact mode for search forms
  compact?: boolean;
  // Blank line span
  emptySpan?: number | Partial<ColEx>;
  // Internal component size of the form
  size?: AntdFormProps['size'];
  // Whether to disable
  disabled?: boolean;
  // Whether to readonly
  readonly?: boolean;
  // Time interval fields are mapped into multiple
  fieldMapToTime?: FieldMapToTime;
  // Placeholder is set automatically
  autoSetPlaceHolder?: boolean;
  // Auto submit on press enter on input
  autoSubmitOnEnter?: boolean;
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;
  // Whether to show collapse and expand buttons
  showAdvancedButton?: boolean;
  // Whether to focus on the first input box, only works when the first form item is input
  autoFocusFirstItem?: boolean;
  // Automatically collapse over the specified number of rows
  autoAdvancedLine?: number;
  // Always show lines
  alwaysShowLines?: number;
  // Whether to show the operation button
  showActionButtonGroup?: boolean;

  // Reset button configuration
  resetButtonOptions?: Partial<ButtonProps>;

  // Confirm button configuration
  submitButtonOptions?: Partial<ButtonProps>;

  // Operation column configuration
  actionColOptions?: Partial<ColEx>;

  // Show reset button
  showResetButton?: boolean;
  // Show confirmation button
  showSubmitButton?: boolean;

  tableAction?: TableActionType;

  resetFunc?: () => Promise<void>;
  submitFunc?: () => Promise<void>;
  transformDateFunc?: (date: any) => string;
  colon?: boolean;

  formHeader?: ReactNode;
  formFooter?: ReactNode;

  onAdvancedChange?: (v: boolean) => void;
  onReset?: () => void;
  onSubmit?: (v: Recordable<any>) => void;
  onChange?: (v: Recordable<any>) => void;
  onFieldValueChange?: (key: string, value: any) => void;
  register?: (action: FormActionType) => void;
}
export type RenderOpts = {
  disabled: boolean;
  [key: string]: any;
};

interface BaseFormSchema<T extends ComponentType = any> {
  // Field name
  field: string;
  // Extra Fields name[]
  fields?: string[];
  // Label name
  label?: ReactNode | ((renderCallbackParams: RenderCallbackParams) => ReactNode);
  // Auxiliary text
  subLabel?: string;
  // Help text on the right side of the text
  helpMessage?:
    | string
    | string[]
    | ((renderCallbackParams: RenderCallbackParams) => string | string[]);
  // BaseHelp component props
  helpComponentProps?: Partial<HelpComponentProps>;
  // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
  labelWidth?: string | number;
  // Disable the adjustment of labelWidth with global settings of formModel, and manually set labelCol and wrapperCol by yourself
  disabledLabelWidth?: boolean;
  // Component parameters
  componentProps?:
    | ((opt: {
        schema: FormSchema;
        tableAction: TableActionType;
        formActionType: FormActionType;
        // formModel: Recordable;
      }) => ComponentProps[T])
    | ComponentProps[T];
  // Required
  required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  suffix?: string | number | ((values: RenderCallbackParams) => string | number);

  // Validation rules
  rules?: Rule[];
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;

  // Reference formModelItem
  itemProps?: Partial<FormItem>;

  // col configuration outside formModelItem
  colProps?: Partial<ColEx>;

  // 默认值
  defaultValue?: any;

  // 额外默认值数组对象
  defaultValueObj?: { [key: string]: any };

  // 是否自动处理与时间相关组件的默认值
  isHandleDateDefaultValue?: boolean;

  isAdvanced?: boolean;

  // Matching details components
  span?: number;

  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  // Render the content in the form-item tag
  render?: (renderCallbackParams: RenderCallbackParams, opts: RenderOpts) => ReactNode;

  // Rendering col content requires outer wrapper form-item
  renderColContent?: (renderCallbackParams: RenderCallbackParams, opts: RenderOpts) => ReactNode;

  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams, opts: RenderOpts) => ReactNode)
    | ReactNode;

  // similar to renderColContent
  colContent?: ReactNode;

  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  dynamicReadonly?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[];
}
export interface ComponentFormSchema<T extends ComponentType = any> extends BaseFormSchema<T> {
  // render component
  component?: T;
}

type ComponentFormSchemaType<T extends ComponentType = ComponentType> = T extends any
  ? ComponentFormSchema<T>
  : never;

export type FormSchema = ComponentFormSchemaType;

export type FormSchemaInner = Partial<ComponentFormSchema> & BaseFormSchema;

export interface HelpComponentProps {
  maxWidth: string;
  // Whether to display the serial number
  showIndex: boolean;
  // Text list
  text: any;
  // colour
  color: string;
  // font size
  fontSize: string;
  icon: string;
  absolute: boolean;
  // Positioning
  position: any;
}
