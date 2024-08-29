import { BasicTitle } from '@/components/Basic';

interface IProps {
  helpMessage?: string | string[];
  title?: string;

  onDbClick: (e: Event) => void;
}

const ModalHeader = (props: IProps) => {
  const { helpMessage, title } = props;
  return <BasicTitle helpMessage={helpMessage}>{title}</BasicTitle>;
};

export default ModalHeader;
