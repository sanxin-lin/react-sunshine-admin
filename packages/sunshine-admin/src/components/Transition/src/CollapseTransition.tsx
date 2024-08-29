import { CSSProperties, ReactNode } from 'react';
import { useCreation } from 'ahooks';

interface IProps {
  children?: ReactNode;
  startHeight?: number;
  endHeight?: number;
  collapse?: boolean;
}

const CollapseTransition = (props: IProps) => {
  const { children, startHeight = 0, endHeight = 0, collapse = true } = props;
  const wrapperStyle = useCreation((): CSSProperties => {
    if (collapse)
      return {
        height: `${startHeight}px`,
      };
    return {
      // TODO CollapseTransition
      // height: `${endHeight}px`,
      overflow: 'hidden',
    };
  }, [collapse, startHeight, endHeight]);
  return (
    <div className="collapse-transition" style={wrapperStyle}>
      {children}
    </div>
  );
};

export default CollapseTransition;
