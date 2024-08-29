import { useEffect, useRef } from 'react';
import { useUnmount } from 'ahooks';

import { useForceRender } from '@/hooks/utils/useForceRender';
import { nextTick } from '@/utils/dom';
import { isProdMode } from '@/utils/env';
import { error } from '@/utils/log';

import type {
  FormActionType,
  FormProps,
  FormSchemaInner as FormSchema,
  UseFormReturnType,
} from '../types/form';

import { Nullable, Recordable } from '#/global';
import { FormInstance } from 'antd';

const ANTD_FORM_METHODS = [
  'getFieldValue',
  'getFieldsValue',
  'getFieldError',
  'getFieldWarning',
  'getFieldsError',
  'isFieldsTouched',
  'isFieldTouched',
  'isFieldValidating',
  'isFieldsValidating',
  'resetFields',
  'setFields',
  'setFieldValue',
  'setFieldsValue',
  'validateFields',
  'submit',
  'getInternalHooks',
  'scrollToField',
  'getFieldInstance',
];

// 将所有表单的方法包装一层
const coverAllFormMethods = <Values extends Recordable>(
  getForm: () => Promise<FormActionType<Values>>,
) => {
  return ANTD_FORM_METHODS.reduce((pre, method) => {
    pre[method] = async (...args: any[]) => {
      const form = await getForm();
      return form?.[method](...args);
    };
    return pre;
  }, {} as FormInstance<Values>);
};

export const useForm = <Values extends Recordable = any>(
  props?: Partial<FormProps>,
): UseFormReturnType<Values> => {
  const formRef = useRef<Nullable<FormActionType<Values>>>(null);
  const loaded = useRef<Nullable<boolean>>(false);

  async function getForm() {
    const form = formRef.current;
    if (!form) {
      error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!',
      );
    }
    await nextTick();
    return form!;
  }

  useUnmount(() => {
    if (isProdMode()) {
      formRef.current = null;
      loaded.current = false;
    }
  });

  useEffect(() => {
    if (props) {
      formRef.current?.setProps(props);
    }
  }, [props]);

  const forceRender = useForceRender();
  const register = (instance: FormActionType) => {
    if (loaded && isProdMode() && instance === formRef.current) return;

    formRef.current = instance;
    loaded.current = true;

    // 强制更新，保证方法最新
    forceRender();
  };

  const actions = {
    ...coverAllFormMethods(getForm),
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm();
      form?.setProps(formProps);
    },

    updateSchemas: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form?.updateSchemas(data);
    },

    resetSchemas: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form?.resetSchemas(data);
    },

    removeSchemaByField: async (field: string | string[]) => {
      const form = await getForm();
      form?.removeSchemaByField(field);
    },

    appendSchemaByField: async (
      schema: FormSchema | FormSchema[],
      prefixField: string | undefined,
      first?: boolean,
    ) => {
      const form = await getForm();
      form?.appendSchemaByField(schema, prefixField, first);
    },
  } as unknown as FormActionType<Values>;

  return [register, actions];
};
