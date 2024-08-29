import { useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { isBoolean, isFunction, isNumber, isPlainObject } from 'lodash-es';

import { useBreakPoint } from '@/hooks/web/useBreakPoint';

import type { ColEx } from '../types';
import type { FormProps, FormSchemaInner as FormSchema } from '../types/form';
import type { AdvanceState } from '../types/hooks';

import { Recordable } from '#/global';

const BASIC_COL_LEN = 24;

interface Options {
  advanceState: AdvanceState;
  props: FormProps;
  schemas: FormSchema[];
  defaultValues: Recordable;
  onAdvancedChange?: (v: boolean) => void;
}

export const useAdvanced = (options: Options) => {
  const { advanceState, props, schemas, onAdvancedChange } = options;
  const { realWidth, screenEnum, screen } = useBreakPoint();
  const [fieldsIsAdvancedMap, updateFieldsIsAdvancedMap] = useState({});

  const emptySpan = (() => {
    if (!advanceState.isAdvanced) {
      return 0;
    }
    // For some special cases, you need to manually specify additional blank lines
    const emptySpan = props.emptySpan || 0;

    if (isNumber(emptySpan)) {
      return emptySpan;
    }
    if (isPlainObject(emptySpan)) {
      const { span = 0 } = emptySpan;

      const screenSpan = (emptySpan as any)[screen.toLowerCase()];
      return screenSpan || span || 0;
    }
    return 0;
  })();

  const getAdvanced = (itemCol: Partial<ColEx>, itemColSum = 0, isLastAction = false) => {
    const width = realWidth;

    const mdWidth =
      parseInt(itemCol.md as string) ||
      parseInt(itemCol.xs as string) ||
      parseInt(itemCol.sm as string) ||
      (itemCol.span as number) ||
      BASIC_COL_LEN;

    const lgWidth = parseInt(itemCol.lg as string) || mdWidth;
    const xlWidth = parseInt(itemCol.xl as string) || lgWidth;
    const xxlWidth = parseInt(itemCol.xxl as string) || xlWidth;
    if (width <= screenEnum.LG) {
      itemColSum += mdWidth;
    } else if (width < screenEnum.XL) {
      itemColSum += lgWidth;
    } else if (width < screenEnum.XXL) {
      itemColSum += xlWidth;
    } else {
      itemColSum += xxlWidth;
    }

    if (isLastAction) {
      advanceState.hideAdvanceBtn = false;
      if (itemColSum <= BASIC_COL_LEN * 2) {
        // When less than or equal to 2 lines, the collapse and expand buttons are not displayed
        advanceState.hideAdvanceBtn = true;
        advanceState.isAdvanced = true;
      } else if (
        itemColSum > BASIC_COL_LEN * 2 &&
        itemColSum <= BASIC_COL_LEN * (props.autoAdvancedLine || 3)
      ) {
        advanceState.hideAdvanceBtn = false;

        // More than 3 lines collapsed by default
      } else if (!advanceState.isLoad) {
        advanceState.isLoad = true;
        advanceState.isAdvanced = !advanceState.isAdvanced;
      }
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    }
    if (itemColSum > BASIC_COL_LEN * (props.alwaysShowLines || 1)) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    } else {
      // The first line is always displayed
      return { isAdvanced: true, itemColSum };
    }
  };

  const updateAdvanced = () => {
    let itemColSum = 0;
    let realItemColSum = 0;
    const { baseColProps = {} } = props;

    for (const schema of schemas) {
      const { show, colProps } = schema;
      let isShow = true;

      if (isBoolean(show)) {
        isShow = show;
      }

      if (isFunction(show)) {
        isShow = show({
          schema: schema,
          field: schema.field,
        });
      }

      if (isShow && (colProps || baseColProps)) {
        const { itemColSum: sum, isAdvanced } = getAdvanced(
          { ...baseColProps, ...colProps },
          itemColSum,
        );

        itemColSum = sum || 0;
        if (isAdvanced) {
          realItemColSum = itemColSum;
        }
        updateFieldsIsAdvancedMap((pre) => ({ ...pre, [schema.field]: isAdvanced }));
      }
    }

    advanceState.actionSpan = (realItemColSum % BASIC_COL_LEN) + emptySpan;

    getAdvanced(props.actionColOptions || { span: BASIC_COL_LEN }, itemColSum, true);
    onAdvancedChange?.(advanceState.isAdvanced);
  };

  const { run: debounceUpdateAdvanced } = useDebounceFn(updateAdvanced, {
    wait: 30,
  });

  useEffect(() => {
    const { showAdvancedButton } = props;
    if (showAdvancedButton) {
      debounceUpdateAdvanced();
    }
  }, [schemas, advanceState.isAdvanced, realWidth]);

  const handleToggleAdvanced = () => {
    advanceState.isAdvanced = !advanceState.isAdvanced;
  };

  return {
    handleToggleAdvanced,
    fieldsIsAdvancedMap,
  };
};
