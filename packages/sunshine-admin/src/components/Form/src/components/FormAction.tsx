import { useCreation } from 'ahooks';
import { Button, Col, Form } from 'antd';

import { BasicArrow } from '@/components/Basic';
import { useLocale } from '@/hooks/web/useLocale';

import { useFormContextSelctor } from '../hooks/context';
import type { ColEx } from '../types';
import { FormActionProps } from '../types/form';

interface IProps extends FormActionProps {}

const FormAction = (props: IProps) => {
  const {
    showActionButtonGroup = true,
    showResetButton = true,
    showSubmitButton = true,
    showAdvancedButton = true,
    resetButtonOptions = {},
    submitButtonOptions = {},
    actionColOptions = {},
    actionSpan = 6,
    isAdvanced,
    hideAdvanceBtn,

    resetBefore,
    submitBefore,
    advanceBefore,
    advanceAfter,

    onToggleAdvanced,
  } = props;

  const { t } = useLocale();

  const { resetAction, submitAction } = useFormContextSelctor((state) => state);

  const actionColOpt = useCreation(() => {
    const _actionSpan = 24 - actionSpan;
    const advancedSpanObj = showAdvancedButton ? { span: _actionSpan < 6 ? 24 : _actionSpan } : {};
    const actionColOpt: Partial<ColEx> = {
      style: { textAlign: 'right' },
      span: showAdvancedButton ? 6 : 4,
      ...advancedSpanObj,
      ...actionColOptions,
    };
    return actionColOpt;
  }, [showAdvancedButton, actionSpan, actionColOptions]);

  const toggleAdvanced = () => {
    onToggleAdvanced?.();
  };

  if (!showActionButtonGroup) return null;

  return (
    <Col {...actionColOpt}>
      <div style={{ width: '100%', textAlign: actionColOpt.style.textAlign }}>
        <Form.Item>
          {resetBefore}
          {showResetButton && (
            <Button type="default" className="mr-2" {...resetButtonOptions} onClick={resetAction}>
              {resetButtonOptions.children ?? t('common.resetText')}
            </Button>
          )}
          {submitBefore}
          {showSubmitButton && (
            <Button type="primary" className="mr-2" {...submitButtonOptions} onClick={submitAction}>
              {submitButtonOptions.children ?? t('common.queryText')}
            </Button>
          )}
          {advanceBefore}
          {showAdvancedButton && !hideAdvanceBtn && (
            <Button type="link" size="small" className="mr-2" onClick={toggleAdvanced}>
              <>
                {isAdvanced ? t('component.form.putAway') : t('component.form.unfold')}
                <BasicArrow up expand={!isAdvanced} className="ml-1" />
              </>
            </Button>
          )}
          {advanceAfter}
        </Form.Item>
      </div>
    </Col>
  );
};

export default FormAction;
