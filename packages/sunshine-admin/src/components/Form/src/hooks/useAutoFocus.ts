import { useEffect } from 'react';

import { nextTick } from '@/utils/dom';

import { type FormProps, type FormSchemaInner as FormSchema } from '../types/form';

import { Nullable } from '#/global';

interface Options {
  schemas: FormSchema[];
  props: FormProps;
  isInitedDefault: boolean;
  uid: string;
}

export const useAutoFocus = (options: Options) => {
  const { props, isInitedDefault, uid, schemas } = options;

  useEffect(() => {
    if (isInitedDefault || !props.autoFocusFirstItem) {
      return;
    }
    nextTick(() => {
      const el = document.querySelector(`.${uid}`);
      if (!el || !schemas || schemas.length === 0) {
        return;
      }

      const firstItem = schemas[0];
      // Only open when the first form item is input type
      if (!firstItem.component || !firstItem.component.includes('Input')) {
        return;
      }

      const inputEl = el.querySelector('.ant-row:first-child input') as Nullable<HTMLInputElement>;
      if (!inputEl) return;
      inputEl?.focus();
    });
  }, [schemas, props.autoFocusFirstItem, isInitedDefault, uid]);
};
