import classNames from 'classnames';

import { Icon } from '@/components/Icon';
import { ThemeEnum } from '@/enums/appEnum';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';

import MenuItem from './components/MenuItem';
import SubMenu from './components/SubMenuItem';
import { SimpleMenuTag } from './SimpleMenuTag';

import { Menu } from '#/router';

interface IProps {
  item?: Menu;
  parent?: boolean;
  collapsedShowTitle?: boolean;
  collapse?: boolean;
  theme?: ThemeEnum;
  hasChildren?: boolean;
}

const SimpleSubMenu: React.FC<IProps> = (props) => {
  const { item = {} as Menu, parent, collapse, collapsedShowTitle, theme, hasChildren } = props;
  const { t } = useLocale();
  const { prefixCls } = useDesign('simple-menu');
  const show = !item.hidden;
  const img = item.img;
  const icon = img ? undefined : item.icon;
  const i18Name = t(item.handle?.title ?? item.name);
  const showSubTitle = !collapse || !parent;
  const isCollapseParent = !!collapse && !!parent;
  const levelClass = classNames({
    [`${prefixCls}__parent`]: parent,
    [`${prefixCls}__children`]: !parent,
    [`${prefixCls}__has__children`]: hasChildren,
  });

  const menuHasChildren = (menuTreeItem: Menu): boolean => {
    return (
      !menuTreeItem.handle?.hideChildrenInMenu &&
      Reflect.has(menuTreeItem, 'children') &&
      !!menuTreeItem.children &&
      menuTreeItem.children.length > 0
    );
  };

  const level = item.handle?.level;

  if (!show) return null;
  if (menuHasChildren(item)) {
    return (
      <SubMenu
        name={item.path}
        className={`${levelClass} ${theme}`}
        collapsedShowTitle={collapsedShowTitle}
        level={level}
        parentId={item.parentId}
        id={item.id}
        childrenCount={item.children?.length ?? 0}
        title={
          <>
            {img && <img src={img} className="w-16px h-16px align-top" />}
            {icon && <Icon icon={icon} size={16} />}
            {collapsedShowTitle && isCollapseParent && (
              <div className="mt-2 collapse-title">{i18Name}</div>
            )}
            {showSubTitle && <span className={`${prefixCls}-sub-title ml-2`}>{i18Name}</span>}
            <SimpleMenuTag item={item} collapseParent={!!collapse && !!parent} />
          </>
        }
      >
        <>
          {item.children!.map((childrenItem) => {
            return (
              <SimpleSubMenu
                {...props}
                item={childrenItem}
                parent={false}
                key={childrenItem.path}
                hasChildren={menuHasChildren(childrenItem)}
              />
            );
          })}
        </>
      </SubMenu>
    );
  }
  return (
    <MenuItem
      name={item.path}
      className={levelClass}
      parentId={item.parentId}
      id={item.id}
      title={
        <>
          <span className={`${prefixCls}-sub-title ml-2`}>{i18Name}</span>
          <SimpleMenuTag item={item} collapseParent={isCollapseParent} />
        </>
      }
      level={level}
    >
      {img && <img src={img} className="w-16px h-16px align-top" />}
      {icon && <Icon icon={icon} size={16} />}
      {collapsedShowTitle && isCollapseParent && (
        <div className="mt-2 collapse-title">{i18Name}</div>
      )}
    </MenuItem>
  );
};

export default SimpleSubMenu;
