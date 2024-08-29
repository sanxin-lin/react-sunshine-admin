import { useCreation } from 'ahooks';
import { Col, Divider, Form } from 'antd';
import { cloneDeep, isBoolean, isFunction, isNil } from 'lodash-es';

import { BasicHelp, BasicTitle } from '@/components/Basic';
import type { TableActionType } from '@/components/Table';
import { useLocale } from '@/hooks/web/useLocale';

import { componentMap } from '../componentMap';
import { isIncludeSimpleComponents, NO_AUTO_LINK_COMPONENTS } from '../helper';
import { useItemLabelWidth } from '../hooks/useItemLabelWidth';
import { ComponentType } from '../types';
import type {
  FormActionType,
  FormProps,
  FormSchemaInner as FormSchema,
  Rule as ValidationRule,
} from '../types/form';

import { Recordable } from '#/global';
import classNames from 'classnames';

interface IProps {
  schema?: FormSchema;
  formProps?: FormProps;
  defaultValues?: Recordable<any>;
  // formModel?: Recordable<any>;
  tableAction?: TableActionType;
  formAction?: FormActionType;
  isAdvanced?: boolean;
}

const FormItem = (props: IProps) => {
  const {
    schema = {} as FormSchema,
    formProps = {} as FormProps,
    defaultValues = {} as Recordable<any>,
    // formModel = {} as Recordable<any>,
    tableAction,
    formAction,
    isAdvanced,
  } = props;
  const { t } = useLocale();

  // TODO 组件 CropperAvatar 的 size 属性类型为 number
  // 此处补充一个兼容
  //   if (schema.value.component === 'CropperAvatar' && typeof formvalue.size === 'string') {
  //     formvalue.size = undefined;
  //   }

  const itemLabelWidthProp = useItemLabelWidth(schema, formProps);

  const values = useCreation(() => {
    const { mergeDynamicData } = formProps;
    return {
      field: schema.field,
      // model: formModel,
      values: {
        ...mergeDynamicData,
        ...defaultValues,
        // ...formModel,
      } as Recordable<any>,
      schema: schema,
    };
  }, [
    defaultValues,
    // formModel,
    schema,
    formProps,
  ]);

  const componentsProps = useCreation(() => {
    let { componentProps = {} } = schema;
    if (isFunction(componentProps)) {
      componentProps =
        componentProps({
          schema,
          tableAction,
          // formModel,
          formAction,
        }) ?? {};
    }
    if (isIncludeSimpleComponents(schema.component)) {
      componentProps = Object.assign(
        { type: 'horizontal' },
        {
          orientation: 'left',
          plain: true,
        },
        componentProps,
      );
    }
    return componentProps as Recordable<any>;
  }, [
    schema,
    tableAction,
    //  formModel,
    formAction,
  ]);

  const disabled = (() => {
    const { disabled: globDisabled } = formProps;
    const { dynamicDisabled } = schema;
    const { disabled: itemDisabled = false } = componentsProps;
    let disabled = !!globDisabled || itemDisabled;
    if (isBoolean(dynamicDisabled)) {
      disabled = dynamicDisabled;
    }
    if (isFunction(dynamicDisabled)) {
      disabled = dynamicDisabled(values);
    }
    return disabled;
  })();

  const readonly = (() => {
    const { readonly: globReadonly } = formProps;
    const { dynamicReadonly } = schema;
    const { readonly: itemReadonly = false } = componentsProps;

    let readonly = globReadonly || itemReadonly;
    if (isBoolean(dynamicReadonly)) {
      readonly = dynamicReadonly;
    }
    if (isFunction(dynamicReadonly)) {
      readonly = dynamicReadonly(values);
    }
    return readonly;
  })();

  const getShow = (): { isShow: boolean; isIfShow: boolean } => {
    const { show, ifShow } = schema;
    const { showAdvancedButton } = formProps;
    const itemIsAdvanced = showAdvancedButton ? (isBoolean(isAdvanced) ? isAdvanced : true) : true;

    let isShow = true;
    let isIfShow = true;

    if (isBoolean(show)) {
      isShow = show;
    }
    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(show)) {
      isShow = show(values);
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(values);
    }
    isShow = isShow && itemIsAdvanced;
    return { isShow, isIfShow };
  };

  /**
   * @description: 生成placeholder
   */
  const createPlaceholderMessage = (component: ComponentType) => {
    if (component.includes('Input') || component.includes('Complete')) {
      return t('common.inputText');
    }
    if (component.includes('Picker')) {
      return t('common.chooseText');
    }
    if (
      component.includes('Select') ||
      component.includes('Cascader') ||
      component.includes('Checkbox') ||
      component.includes('Radio') ||
      component.includes('Switch')
    ) {
      // return `请选择${label}`;
      return t('common.chooseText');
    }
    return '';
  };

  const setComponentRuleType = (
    rule: ValidationRule,
    component: ComponentType,
    valueFormat: string,
  ) => {
    if (Reflect.has(rule, 'type')) {
      return;
    }
    if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
      rule.type = valueFormat ? 'string' : 'object';
    } else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
      rule.type = 'array';
    } else if (['InputNumber'].includes(component)) {
      rule.type = 'number';
    }
  };

  const handleRules = (): ValidationRule[] => {
    const {
      rules: defRules = [],
      component,
      rulesMessageJoinLabel,
      label,
      dynamicRules,
      required,
    } = schema;
    if (isFunction(dynamicRules)) {
      return dynamicRules(values) as ValidationRule[];
    }

    let rules: ValidationRule[] = cloneDeep(defRules) as ValidationRule[];
    const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = formProps;

    const joinLabel = Reflect.has(schema, 'rulesMessageJoinLabel')
      ? rulesMessageJoinLabel
      : globalRulesMessageJoinLabel;

    const assertLabel = joinLabel ? (isFunction(label) ? '' : label) : '';
    const defaultMsg = component ? createPlaceholderMessage(component) + assertLabel : assertLabel;

    const validator = (rule: any, value: any) => {
      const msg = rule.message || defaultMsg;
      if (value === undefined || isNil(value)) {
        // 空值
        return Promise.reject(msg);
      } else if (Array.isArray(value) && value.length === 0) {
        // 数组类型
        return Promise.reject(msg);
      } else if (typeof value === 'string' && value.trim() === '') {
        // 空字符串
        return Promise.reject(msg);
      } else if (
        typeof value === 'object' &&
        Reflect.has(value, 'checked') &&
        Reflect.has(value, 'halfChecked') &&
        Array.isArray(value.checked) &&
        Array.isArray(value.halfChecked) &&
        value.checked.length === 0 &&
        value.halfChecked.length === 0
      ) {
        // 非关联选择的tree组件
        return Promise.reject(msg);
      }
      return Promise.resolve();
    };

    /*
     * 1、若设置了required属性，又没有其他的rules，就创建一个验证规则；
     * 2、若设置了required属性，又存在其他的rules，则只rules中不存在required属性时，才添加验证required的规则
     *     也就是说rules中的required，优先级大于required
     */
    const currentRequired = isFunction(required) ? required(values) : required;

    if (currentRequired) {
      if (!rules || rules.length === 0) {
        const validateTrigger = NO_AUTO_LINK_COMPONENTS.includes(component || 'Input')
          ? 'blur'
          : 'change';
        rules = [{ required: currentRequired, validator, validateTrigger }];
      } else {
        const requiredIndex: number = rules.findIndex((rule) => Reflect.has(rule, 'required'));

        if (requiredIndex === -1) {
          rules.push({ required: currentRequired, validator });
        }
      }
    }

    const requiredRuleIndex: number = rules.findIndex(
      (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
    );

    if (requiredRuleIndex !== -1) {
      const rule = rules[requiredRuleIndex];
      const { isShow } = getShow();
      if (!isShow) {
        rule.required = false;
      }
      if (component) {
        rule.message = (rule.message || defaultMsg) as any;

        if (component.includes('Input') || component.includes('Textarea')) {
          rule.whitespace = true;
        }
        const valueFormat = componentsProps.valueFormat;
        setComponentRuleType(rule, component, valueFormat);
      }
    }

    // Maximum input length rule check
    const characterInx = rules.findIndex((val) => val.max);
    if (characterInx !== -1 && !rules[characterInx].validator) {
      rules[characterInx].message = (rules[characterInx].message ||
        t('component.form.maxTip', [rules[characterInx].max] as Recordable<any>)) as any;
    }
    return rules;
  };

  const renderComponent = () => {
    const { renderComponentContent, component } = schema;
    const { autoSetPlaceHolder, size } = formProps;

    const propsData: Recordable<any> = {
      allowClear: true,
      size,
      ...componentsProps,
      disabled,
      readonly,
    };

    const Comp = componentMap[component];

    const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;

    // RangePicker place is an array
    if (isCreatePlaceholder && component !== 'RangePicker' && component) {
      propsData.placeholder = componentsProps.placeholder || createPlaceholderMessage(component);
    }

    propsData.formValues = { ...values };

    const compAttr: Recordable<any> = {
      ...propsData,
    };

    if (!renderComponentContent) {
      return <Comp {...compAttr} />;
    }

    const content = isFunction(renderComponentContent)
      ? renderComponentContent(
          { ...values },
          {
            disabled,
            readonly,
          },
        )
      : renderComponentContent;

    return <Comp {...compAttr}>{content}</Comp>;
  };

  const renderLabelHelpMessage = () => {
    const { label, helpMessage, helpComponentProps, subLabel } = schema;
    const getLabel = isFunction(label) ? label({ ...values }) : label;
    const renderLabel = subLabel ? (
      <span>
        {getLabel} <span className="text-secondary">{subLabel}</span>
      </span>
    ) : (
      getLabel
    );
    const getHelpMessage = isFunction(helpMessage) ? helpMessage({ ...values }) : helpMessage;
    if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
      return renderLabel;
    }
    return (
      <span>
        {renderLabel}
        <BasicHelp placement="top" className="mx-1" text={getHelpMessage} {...helpComponentProps} />
      </span>
    );
  };

  const renderItem = () => {
    const { itemProps, render, field, component, suffix } = schema;
    const { labelCol, wrapperCol } = itemLabelWidthProp;
    const { colon } = formProps;
    const opts = { disabled, readonly };
    if (component === 'Divider') {
      return (
        <Col span={24}>
          <Divider {...componentsProps}>{renderLabelHelpMessage()}</Divider>
        </Col>
      );
    } else if (component === 'BasicTitle') {
      return (
        <Form.Item
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          name={field}
          className={classNames({ 'suffix-item': !!suffix })}
        >
          <BasicTitle {...componentsProps}>{renderLabelHelpMessage()}</BasicTitle>
        </Form.Item>
      );
    } else {
      const getContent = () => {
        return render ? render({ ...values }, opts) : renderComponent();
      };

      const getSuffix = isFunction(suffix) ? suffix(values) : suffix;

      // TODO 自定义组件验证会出现问题，因此这里框架默认将自定义组件设置手动触发验证，如果其他组件还有此问题请手动设置autoLink=false
      if (component && NO_AUTO_LINK_COMPONENTS.includes(component)) {
        props.schema &&
          (props.schema.itemProps! = {
            autoLink: false,
            ...props.schema.itemProps,
          });
      }

      return (
        <Form.Item
          name={field}
          colon={colon}
          className={classNames({ 'suffix-item': !!suffix })}
          {...(itemProps as Recordable<any>)}
          label={renderLabelHelpMessage()}
          rules={handleRules()}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          {!!suffix ? (
            <div className="flex">
              <div className="flex-1">
                <Form.Item name={field} noStyle>
                  {getContent()}
                </Form.Item>
              </div>
              <span className="suffix">{getSuffix}</span>
            </div>
          ) : (
            getContent()
          )}
        </Form.Item>
      );
    }
  };

  const render = () => {
    const { colProps = {}, colContent, renderColContent, component } = schema;
    if (!(component && componentMap[component])) {
      return null;
    }

    const { baseColProps = {} } = formProps;
    const realColProps = { ...baseColProps, ...colProps };
    const { isIfShow, isShow } = getShow();
    const opts = { disabled, readonly };

    const getContent = () => {
      return colContent
        ? colContent
        : renderColContent
          ? renderColContent(values, opts)
          : renderItem();
    };

    return (
      isIfShow && (
        <Col {...realColProps} style={isShow ? {} : { display: 'none' }}>
          {getContent()}
        </Col>
      )
    );
  };

  return render();
};

export default FormItem;
