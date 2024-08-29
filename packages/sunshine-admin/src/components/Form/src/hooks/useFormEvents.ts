import { useMemoizedFn } from 'ahooks';
import { FormInstance } from 'antd';
import {
  // get,
  // has,
  isArray,
  isFunction,
  isNil,
  isPlainObject,
  isString,
  merge,
  uniqBy,
} from 'lodash-es';

// import { dateUtil } from '@/utils/date';
import { nextTick } from '@/utils/dom';
import { error } from '@/utils/log';

import {
  // DATE_TYPE_COMPONENTS,
  // handleInputNumberValue,
  isIncludeSimpleComponents,
} from '../helper';
import type { FormActionType, FormProps, FormSchemaInner as FormSchema } from '../types/form';

import { Recordable } from '#/global';

interface Options {
  props: FormProps;
  updateSchemas: (v: FormSchema[]) => void;
  formRef: FormInstance<any>;
  getFormatSchemas: () => FormSchema[];
}

// const checkIsRangeSlider = (schema: FormSchema) => {
//   if (schema.component === 'Slider' && schema.componentProps && 'range' in schema.componentProps) {
//     return true;
//   }
// };

// const checkIsInput = (schema?: FormSchema) => {
//   return schema?.component && DEFAULT_VALUE_COMPONENTS.includes(schema.component);
// };

// const getDefaultValue = (
//   schema: FormSchema | undefined,
//   defaultValues: Recordable,
//   key: string,
// ) => {
//   let defaultValue = cloneDeep(defaultValues[key]);
//   const isInput = checkIsInput(schema);
//   if (isInput) {
//     return defaultValue || undefined;
//   }
//   if (!defaultValue && schema && checkIsRangeSlider(schema)) {
//     defaultValue = [0, 0];
//   }
//   if (!defaultValue && schema && schema.component === 'ApiTree') {
//     defaultValue = [];
//   }
//   return defaultValue;
// };

export const useFormEvents = (options: Options) => {
  const { props, updateSchemas, formRef, getFormatSchemas } = options;

  const formAction: Partial<FormActionType> = {};

  // const itemIsDateType = (key: string) => {
  //   return getFormatSchemas().some((item) => {
  //     return item.field === key && item.component
  //       ? DATE_TYPE_COMPONENTS.includes(item.component)
  //       : false;
  //   });
  // };

  const resetFields = useMemoizedFn(async () => {
    const { resetFunc, submitOnReset, onReset } = props;
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    if (!formRef) return;

    formRef.resetFields();

    nextTick(() => {
      onReset?.();
      submitOnReset && handleSubmit();
    });
  });

  // // 获取表单fields
  // const getAllFields = () =>
  //   getFormatSchemas()
  //     .map((item) => [...(item.fields || []), item.field])
  //     .flat(1)
  //     .filter(Boolean);

  // const setFieldsValue = async (values: Recordable) => {
  //   if (Object.keys(values).length === 0) {
  //     return;
  //   }
  //   const fields = getAllFields();
  //   const validKeys: string[] = [];
  //   const formatSchemas = getFormatSchemas();
  //   fields.forEach((key) => {
  //     const schema = formatSchemas.find((item) => item.field === key);
  //     let value = get(values, key);
  //     const hasKey = has(values, key);

  //     value = handleInputNumberValue(schema?.component, value);
  //     const { componentProps } = schema || {};
  //     let _props = componentProps as any;
  //     if (isFunction(_props)) {
  //       _props = _props({
  //         formAction,
  //       });
  //     }

  //     const setDateFieldValue = (v) => {
  //       return v ? (_props?.valueFormat ? v : dateUtil(v)) : null;
  //     };

  //     if (hasKey) {
  //       // time type
  //       if (itemIsDateType(key)) {
  //         if (Array.isArray(value)) {
  //           const arr: any[] = [];
  //           for (const ele of value) {
  //             arr.push(setDateFieldValue(ele));
  //           }
  //         }
  //       }
  //       _props?.onChange?.(value);
  //       validKeys.push(key);
  //     }
  //   });
  //   formRef?.validateFields(validKeys).catch(() => {});
  // };

  /**
   * @description: Delete based on field name
   */
  const _removeSchemaByField = (field: string, schemaList: FormSchema[]) => {
    if (isString(field)) {
      const index = schemaList.findIndex((schema) => schema.field === field);
      if (index !== -1) {
        schemaList.splice(index, 1);
      }
    }
  };

  /**
   * @description: Delete based on field name
   */
  const removeSchemaByField = async (fields: string | string[]) => {
    if (!fields) {
      return;
    }
    const formatSchemas = getFormatSchemas();
    const fieldList: string[] = isString(fields) ? [fields] : fields;

    for (const field of fieldList) {
      _removeSchemaByField(field, formatSchemas);
    }
    updateSchemas(formatSchemas);
  };

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  const appendSchemaByField = async (
    schema: FormSchema | FormSchema[],
    prefixField?: string,
    first = false,
  ) => {
    const formatSchemas = getFormatSchemas();
    const addSchemaIds: string[] = Array.isArray(schema)
      ? schema.map((item) => item.field)
      : [schema.field];
    if (formatSchemas.find((item) => addSchemaIds.includes(item.field))) {
      error('There are schemas that have already been added');
      return;
    }

    const index = formatSchemas.findIndex((schema) => schema.field === prefixField);
    const schemaList = isPlainObject(schema) ? [schema as FormSchema] : (schema as FormSchema[]);
    if (!prefixField || index === -1 || first) {
      first ? formatSchemas.unshift(...schemaList) : schemaList.push(...schemaList);
    } else if (index !== -1) {
      schemaList.splice(index + 1, 0, ...schemaList);
    }
    updateSchemas(formatSchemas);
    _setDefaultValue(schema);
  };

  const resetSchemas = async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
    let updateData: Partial<FormSchema>[] = [];
    if (isPlainObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) =>
        isIncludeSimpleComponents(item.component) || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      error(
        'All children of the form Schema array that need to be updated must contain the `field` field',
      );
      return;
    }
    updateSchemas(updateData as FormSchema[]);
  };

  const updateSchemasFn = async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
    let updateData: Partial<FormSchema>[] = [];
    if (isPlainObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    const hasField = updateData.every(
      (item) =>
        isIncludeSimpleComponents(item.component) || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      error(
        'All children of the form Schema array that need to be updated must contain the `field` field',
      );
      return;
    }

    const formatSchemas = getFormatSchemas();
    const schemas: FormSchema[] = [];
    const updatedSchemas: FormSchema[] = [];
    formatSchemas.forEach((val) => {
      const updatedItem = updateData.find((item) => val.field === item.field);
      if (updatedItem) {
        const newSchema = merge(val, updatedItem);
        updatedSchemas.push(newSchema as FormSchema);
        schemas.push(newSchema as FormSchema);
      } else {
        schemas.push(val);
      }
    });

    _setDefaultValue(updatedSchemas);
    updateSchemas(uniqBy(schemas, 'field'));
  };

  const _setDefaultValue = (data: FormSchema | FormSchema[]) => {
    let schemas: FormSchema[] = [];
    if (isPlainObject(data)) {
      schemas.push(data as FormSchema);
    }
    if (isArray(data)) {
      schemas = [...data];
    }

    const obj: Recordable = {};
    const currentFieldsValue = formRef?.getFieldsValue();
    schemas.forEach((item) => {
      if (
        !isIncludeSimpleComponents(item.component) &&
        Reflect.has(item, 'field') &&
        item.field &&
        !isNil(item.defaultValue) &&
        (!(item.field in currentFieldsValue) || isNil(currentFieldsValue[item.field]))
      ) {
        obj[item.field] = item.defaultValue;
      }
    });
    formRef?.setFieldsValue(obj);
  };

  /**
   * @description: Form submission
   */
  const handleSubmit = useMemoizedFn(async (e?: any) => {
    e?.preventDefault();

    const { submitFunc, onSubmit } = props;
    if (isFunction(submitFunc)) {
      await submitFunc();
      return;
    }

    if (!formRef) return;

    try {
      const values = await formRef?.validateFields();
      onSubmit?.(values);
    } catch (error: any) {
      if (error?.outOfDate === false && error?.errorFields) {
        return;
      }
      throw new Error(error);
    }
  });

  Object.assign(formAction, {
    resetFields,
    updateSchemas: updateSchemasFn,
    resetSchemas,
    removeSchemaByField,
    appendSchemaByField,
    submit: handleSubmit,
  });

  return {
    resetFields,
    updateSchemas: updateSchemasFn,
    resetSchemas,
    removeSchemaByField,
    appendSchemaByField,
    handleSubmit,
  };
};
