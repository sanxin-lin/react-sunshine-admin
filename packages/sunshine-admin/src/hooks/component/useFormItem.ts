import { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash-es';

import { Recordable } from '#/global';

export const useFormItem = <T extends Recordable>({
  props,
  key = 'value',
  changeEvent = 'onChange',
}: {
  props: T;
  key: keyof T;
  changeEvent?: string;
}) => {
  const value = props[key];
  const [innerState, setInnerState] = useState(value);
  const defaultState = useRef(value);

  const setState = (v: T[keyof T]) => {
    setInnerState(v);
  };

  useEffect(() => {
    setState(value);
  }, [value]);

  const onChange = (v: any) => {
    if (isEqual(v, defaultState.current)) return;
    props?.[changeEvent](v);
  };

  return {
    value: innerState,
    setValue: setState,
    onChange,
    defaultValue: defaultState,
  };
};
