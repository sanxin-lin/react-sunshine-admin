import { useCreation } from 'ahooks';
import { isNumber } from 'lodash-es';

import type { FormProps, FormSchemaInner as FormSchema } from '../types/form';

export const useItemLabelWidth = (schema: FormSchema, formProps: FormProps) => {
  return useCreation(() => {
    const { labelCol = {}, wrapperCol = {} } = schema.itemProps || {};
    const { labelWidth, disabledLabelWidth } = schema;

    const {
      labelWidth: globalLabelWidth,
      labelCol: globalLabelCol,
      wrapperCol: globWrapperCol,
      layout,
    } = formProps;

    // If labelWidth is set globally, all items setting
    if ((!globalLabelWidth && !labelWidth && !globalLabelCol) || disabledLabelWidth) {
      labelCol.style = {
        textAlign: 'left',
      };
      return { labelCol, wrapperCol };
    }
    let width = labelWidth || globalLabelWidth;
    const col = { ...globalLabelCol, ...labelCol };
    const wrapCol = { ...globWrapperCol, ...wrapperCol };

    if (width) {
      width = isNumber(width) ? `${width}px` : width;
    }

    return {
      labelCol: { style: { width }, ...col },
      wrapperCol: {
        style: { width: layout === 'vertical' ? '100%' : `calc(100% - ${width})` },
        ...wrapCol,
      },
    };
  }, [schema, formProps]);
};
