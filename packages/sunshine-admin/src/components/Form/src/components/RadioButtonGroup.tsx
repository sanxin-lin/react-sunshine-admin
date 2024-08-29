import { useCreation } from 'ahooks';
import { Radio, RadioGroupProps } from 'antd';
import { isString } from 'lodash-es';

type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean };
type RadioItem = string | OptionsItem;
interface IProps extends RadioGroupProps {
  options: RadioItem[];
}

const RadioButtonGroup = (props: IProps) => {
  const { options = [], ...wrapperProps } = props;

  const currentOptions = useCreation(() => {
    if (!options || options?.length === 0) return [];

    const isStringArr = options.some((item) => isString(item));
    if (!isStringArr) return options as OptionsItem[];

    return options.map((item) => ({ label: item, value: item })) as OptionsItem[];
  }, [options]);

  const onClick = () => {};

  return (
    <Radio.Group {...wrapperProps} buttonStyle="solid">
      {currentOptions.map((option, index) => (
        <Radio.Button key={index} disabled={option.disabled} onClick={onClick}>
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default RadioButtonGroup;
