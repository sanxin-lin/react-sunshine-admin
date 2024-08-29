import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface IProps {
  to: Parameters<typeof createPortal>[1];
  children: ReactNode;
}

const Portal: React.FC<IProps> = (props) => {
  const { children, to } = props;

  return createPortal(children, to);
};

export default Portal;
