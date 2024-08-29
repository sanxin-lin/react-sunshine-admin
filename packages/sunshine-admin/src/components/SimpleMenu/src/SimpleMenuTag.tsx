import classNames from 'classnames';

import { useDesign } from '@/hooks/web/useDesign';

import { BaseProps } from '#/compoments';
import { Menu } from '#/router';

interface IProps extends BaseProps {
  item?: Menu;
  dot?: boolean;
  collapseParent?: boolean;
}

export const SimpleMenuTag: React.FC<IProps> = (props) => {
  const { item = {} as Menu, dot, collapseParent, ...wrapperProps } = props;

  const { prefixCls } = useDesign('simple-menu');

  const showTag = (() => {
    const { tag } = item;
    if (!tag) return;
    const { dot, content } = tag;
    if (!dot && !content) return false;
    return true;
  })();

  const content = (() => {
    if (!showTag) return '';
    const { tag } = item;
    const { dot, content } = tag!;
    return dot || collapseParent ? '' : content;
  })();

  const wrapperClassName = (() => {
    const { tag = {} } = item || {};
    const { type = 'error' } = tag;
    const tagCls = `${prefixCls}-tag`;
    return classNames(`${tagCls} ${tagCls}--${type}`, {
      [`${tagCls}--collapse`]: collapseParent,
      [`${tagCls}--dot`]: tag.dot || dot,
    });
  })();

  if (!showTag) return null;

  return (
    <span {...wrapperProps} className={wrapperClassName}>
      {content}
    </span>
  );
};
