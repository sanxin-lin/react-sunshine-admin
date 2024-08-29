import { BasicDrawer, useDrawerInner, type DrawerProps } from '@/components/Drawer';
import { BasicForm, useForm, type FormSchema } from '@/components/Form';
import { useMemoizedFn } from 'ahooks';

const DrawerExample4 = (props: DrawerProps) => {
  const { register: inputRegister } = props;
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 12,
      },
      defaultValue: '111',
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      colProps: {
        span: 12,
      },
    },
  ];
  const [registerForm, { setFieldsValue }] = useForm({
    labelWidth: 120,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const [register] = useDrawerInner(inputRegister, (data) => {
    setFieldsValue({
      field2: data.data,
      field1: data.info,
    });
  });

  return (
    <BasicDrawer {...props} register={register} title="Drawer Title" width="50%">
      <BasicForm register={registerForm} />
    </BasicDrawer>
  );
};

export default DrawerExample4;
