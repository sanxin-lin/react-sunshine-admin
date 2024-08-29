import JsonView from 'react-json-view';

interface IProps {
  data?: string;
}

const JsonPreview = (props: IProps) => {
  const { data = '' } = props;
  return <JsonView style={{ height: '780px' }} src={data as any} collapsed={3} />;
};

export default JsonPreview;
