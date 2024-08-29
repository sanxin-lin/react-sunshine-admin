import './ThembUrl.less';
import { Image } from 'antd';

interface IProps {
  fileUrl?: string;
}

const ThumbUrl = (props: IProps) => {
  const { fileUrl = '' } = props;

  return <span className="thumb">{fileUrl ? <Image src={fileUrl} width={104} /> : null}</span>;
};

export default ThumbUrl;
