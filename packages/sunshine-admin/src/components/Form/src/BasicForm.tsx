import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useCreation, useMount, useReactive } from 'ahooks';
import { Form, Row } from 'antd';
import classNames from 'classnames';
import { cloneDeep, isFunction, merge, uniqueId } from 'lodash-es';

import { useModalContextSelctor } from '@/components/Modal';
import { TableActionType } from '@/components/Table';
import { useEarliest } from '@/hooks/utils/useEarliest';
import { useGetState } from '@/hooks/utils/useGetState';
import { useDesign } from '@/hooks/web/useDesign';
import { dateUtil } from '@/utils/date';
import { nextTick } from '@/utils/dom';

import FormAction from './components/FormAction';
import FormItem from './components/FormItem';
import { createFormProviderValue, FormContext, FormContextProps } from './hooks/context';
import { useAdvanced } from './hooks/useAdvanced';
import { useAutoFocus } from './hooks/useAutoFocus';
import { useFormEvents } from './hooks/useFormEvents';
import { useFormValues } from './hooks/useFormValues';
import type {
  FormActionProps,
  FormActionType,
  FormProps,
  FormSchemaInner as FormSchema,
} from './types/form';
import type { AdvanceState } from './types/hooks';
import { DATE_TYPE_COMPONENTS, isIncludeSimpleComponents } from './helper';

import './BasicForm.less';

interface IProps extends FormProps {}

const BasicForm = forwardRef<FormActionType, IProps & FormActionProps>((props, ref) => {
  const { formFooter, formHeader, tableAction, register } = props;

  const { redoModalHeight } = useModalContextSelctor((state) => ({
    redoModalHeight: state.redoModalHeight,
  }));

  const [defaultValues, setDefaultValues] = useState({});

  const updateDefaultValues = (v: any) => {
    setDefaultValues(v);
  };

  const [isInitedDefault, setIsInitedDefault] = useState(false);
  const [inputProps, setInputProps] = useState<Partial<FormProps>>();
  const [schemas, setSchemas, getSchemas] = useGetState<FormSchema[] | null>(null);
  const updateSchemasFn = (v: FormSchema[]) => {
    setSchemas(v);
  };
  const [formRef] = Form.useForm();
  const uid = useEarliest(() => `form-instance-${uniqueId()}`);
  const advanceState = useReactive<AdvanceState>({
    isAdvanced: true,
    hideAdvanceBtn: false,
    isLoad: false,
    actionSpan: 6,
  });

  const { prefixCls } = useDesign('basic-form');

  const currentProps = useCreation(
    () => ({
      ...props,
      ...inputProps,
    }),
    [props, inputProps],
  );

  const formClass = useCreation(() => {
    return classNames(`${prefixCls} ${uid}`, {
      [`${prefixCls}--compact`]: currentProps.compact,
    });
  }, [currentProps.compact]);

  // Get uniform row style and Row configuration for the entire form
  const rowProps = useCreation(() => {
    const { baseRowStyle = {}, rowProps } = currentProps;
    return {
      style: baseRowStyle,
      ...rowProps,
    };
  }, [currentProps.baseColProps, currentProps.rowProps]);

  const formActionProps = useCreation(() => {
    return {
      ...currentProps,
      ...advanceState,
    } as any;
  }, [currentProps, advanceState]);

  const getFormatSchemas = () => {
    const _schemas: FormSchema[] = cloneDeep((getSchemas() || currentProps.schemas) ?? []);
    for (const schema of _schemas) {
      const {
        defaultValue,
        component,
        componentProps = {},
        isHandleDateDefaultValue = true,
      } = schema;
      // handle date type
      if (
        isHandleDateDefaultValue &&
        defaultValue &&
        component &&
        DATE_TYPE_COMPONENTS.includes(component)
      ) {
        const opt = {
          schema,
          tableAction: currentProps.tableAction ?? ({} as TableActionType),
          formAction: getFormAction(),
        };

        const valueFormat = componentProps
          ? isFunction(componentProps)
            ? componentProps(opt)['valueFormat']
            : componentProps['valueFormat']
          : null;

        if (!Array.isArray(defaultValue)) {
          schema.defaultValue = valueFormat
            ? dateUtil(defaultValue).format(valueFormat)
            : dateUtil(defaultValue);
        } else {
          const def: any[] = [];
          defaultValue.forEach((item) => {
            def.push(valueFormat ? dateUtil(item).format(valueFormat) : dateUtil(item));
          });
          schema.defaultValue = def;
        }
      }
    }
    if (currentProps.showAdvancedButton) {
      return _schemas.filter((schema) => !isIncludeSimpleComponents(schema.component));
    }

    return _schemas;
  };

  const formatSchemas = useCreation(() => {
    return getFormatSchemas();
  }, [schemas, props.schemas]);

  const { handleToggleAdvanced, fieldsIsAdvancedMap } = useAdvanced({
    advanceState,
    props: currentProps,
    schemas: formatSchemas,
    defaultValues,
  });

  const { initDefault } = useFormValues({
    updateDefaultValues,
    schemas: formatSchemas,
  });

  useAutoFocus({
    schemas: formatSchemas,
    props: currentProps,
    isInitedDefault: isInitedDefault,
    uid: uid.current,
  });

  const {
    handleSubmit,
    updateSchemas,
    resetSchemas,
    appendSchemaByField,
    removeSchemaByField,
    resetFields,
  } = useFormEvents({
    props: currentProps,
    formRef,
    getFormatSchemas,
    updateSchemas: updateSchemasFn,
  });

  const contextValue = createFormProviderValue(
    useCreation<FormContextProps>(() => {
      return {
        resetAction: resetFields,
        submitAction: handleSubmit,
      };
    }, [resetFields, handleSubmit]),
  );

  useEffect(() => {
    resetSchemas(currentProps.schemas ?? []);
  }, [currentProps.schemas]);

  useEffect(() => {
    nextTick(() => {
      redoModalHeight?.();
    });
    if (isInitedDefault) {
      return;
    }
    if (schemas?.length) {
      initDefault();
      setIsInitedDefault(true);
    }
  }, [schemas]);

  const setProps = async (formProps: Partial<FormProps>) => {
    setInputProps(merge({ ...(inputProps || {}) }, formProps));
  };

  const handleEnterPress: any = (e: KeyboardEvent) => {
    const { autoSubmitOnEnter } = currentProps;
    if (!autoSubmitOnEnter) return;
    if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
      const target: HTMLElement = e.target as HTMLElement;
      if (target && target.tagName && target.tagName.toUpperCase() === 'INPUT') {
        handleSubmit();
      }
    }
  };

  const getFormAction = () => {
    return {
      ...(formRef ?? {}),
      resetFields,
      updateSchemas,
      resetSchemas,
      setProps,
      removeSchemaByField,
      appendSchemaByField,
      submit: handleSubmit,
    } as unknown as FormActionType;
  };

  useImperativeHandle(ref, () => getFormAction());

  useMount(() => {
    initDefault();
    register?.(getFormAction());
  });

  return (
    <FormContext.Provider value={contextValue}>
      <Form {...currentProps} className={formClass} form={formRef} onKeyDown={handleEnterPress}>
        <Row {...rowProps}>
          {formHeader}
          {formatSchemas.map((schema) => (
            <FormItem
              key={schema.field}
              isAdvanced={fieldsIsAdvancedMap[schema.field]}
              tableAction={tableAction}
              formAction={getFormAction()}
              schema={schema}
              formProps={currentProps}
              defaultValues={defaultValues}
            />
          ))}

          <FormAction {...formActionProps} onToggleAdvanced={handleToggleAdvanced} />
          {formFooter}
        </Row>
      </Form>
    </FormContext.Provider>
  );
});

export default BasicForm;
