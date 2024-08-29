import {
  cloneDeep,
  // get,
  // isArray,
  // isEmpty,
  // isFunction,
  isNil,
  // isPlainObject,
  // isString,
  // set,
  // unset,
} from 'lodash-es';

// import { dateUtil } from '@/utils/date';
import type { FormSchemaInner as FormSchema } from '../types/form';

import { Recordable } from '#/global';

interface Options {
  updateDefaultValues: (v: any) => void;
  schemas: FormSchema[];
  // props: FormProps;
}

// /**
//  * @description deconstruct array-link key. This method will mutate the target.
//  */
// const tryDeconstructArray = (key: string, value: any, target: Recordable) => {
//   const pattern = /^\[(.+)\]$/;
//   if (pattern.test(key)) {
//     const match = key.match(pattern);
//     if (match && match[1]) {
//       const keys = match[1].split(',');
//       value = isArray(value) ? value : [value];
//       keys.forEach((k, index) => {
//         set(target, k.trim(), value[index]);
//       });
//       return true;
//     }
//   }
// };

// /**
//  * @description deconstruct object-link key. This method will mutate the target.
//  */
// const tryDeconstructObject = (key: string, value: any, target: Recordable) => {
//   const pattern = /^\{(.+)\}$/;
//   if (pattern.test(key)) {
//     const match = key.match(pattern);
//     if (match && match[1]) {
//       const keys = match[1].split(',');
//       value = isPlainObject(value) ? value : {};
//       keys.forEach((k) => {
//         set(target, k.trim(), value[k.trim()]);
//       });
//       return true;
//     }
//   }
// };

// const formatTime = (time: string, format: string) => {
//   if (format === 'timestamp') {
//     return dateUtil(time).unix();
//   } else if (format === 'timestampStartDay') {
//     return dateUtil(time).startOf('day').unix();
//   }
//   return dateUtil(time).format(format);
// };

export const useFormValues = (options: Options) => {
  const { updateDefaultValues, schemas } = options;

  /**
   * @description: Processing time interval parameters
   */
  // const handleRangeTimeValue = (values: Recordable) => {
  //   const fieldMapToTime = props.fieldMapToTime;

  //   if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
  //     return values;
  //   }

  //   for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
  //     if (!field || !startTimeKey || !endTimeKey) {
  //       continue;
  //     }
  //     // If the value to be converted is empty, remove the field
  //     if (!get(values, field)) {
  //       unset(values, field);
  //       continue;
  //     }

  //     const [startTime, endTime]: string[] = get(values, field);

  //     const [startTimeFormat, endTimeFormat] = Array.isArray(format) ? format : [format, format];

  //     if (!isNil(startTime) && !isEmpty(startTime)) {
  //       set(values, startTimeKey, formatTime(startTime, startTimeFormat));
  //     }
  //     if (!isNil(endTime) && !isEmpty(endTime)) {
  //       set(values, endTimeKey, formatTime(endTime, endTimeFormat));
  //     }
  //     unset(values, field);
  //   }

  //   return values;
  // };

  // // Processing form values
  // const handleFormValues = (values: Recordable) => {
  //   if (!isPlainObject(values)) return {};
  //   const res: Recordable = {};
  //   for (const item of Object.entries(values)) {
  //     let [, value] = item;
  //     const [key] = item;
  //     if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
  //       continue;
  //     }

  //     const transformDateFunc = props.transformDateFunc;
  //     if (isPlainObject(value)) {
  //       value = transformDateFunc?.(value);
  //     }
  //     if (isArray(value) && value[0]?.format && value[1]?.format) {
  //       value = value.map((item) => transformDateFunc?.(item));
  //     }

  //     // Remove spaces
  //     if (isString(value)) {
  //       value = value.trim();
  //     }

  //     if (!tryDeconstructArray(key, value, res) && !tryDeconstructObject(key, value, res)) {
  //       // 没有解构成功的，按原样赋值
  //       set(res, key, value);
  //     }

  //     return handleRangeTimeValue(res);
  //   }
  // };

  const initDefault = () => {
    const obj: Recordable = {};
    schemas.forEach((item) => {
      const { defaultValue, defaultValueObj } = item;
      const fieldKeys = Object.keys(defaultValueObj || {});
      if (fieldKeys.length) {
        fieldKeys.forEach((field) => {
          obj[field] = defaultValueObj![field];
        });
      }
      if (!isNil(defaultValue)) {
        obj[item.field] = defaultValue;
      }
    });
    updateDefaultValues(cloneDeep(obj));
  };

  return { initDefault };
};
