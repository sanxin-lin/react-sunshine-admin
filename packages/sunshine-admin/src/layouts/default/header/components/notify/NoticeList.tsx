import { useEffect, useState } from 'react';
import { useCreation } from 'ahooks';
import { Avatar, List, Tag, Typography } from 'antd';
import { isNumber } from 'lodash-es';

import { useDesign } from '@/hooks/web/useDesign';

import { ListItem } from './data';

import './NoticeList.less';

interface IProps {
  list?: ListItem[];
  pageSize?: boolean | number;
  currentPage?: number;
  titleRows?: number;
  descRows?: number;
  onTitleClick?: (params: ListItem) => void;
  onUpdatePage?: (page: number) => void;
}

const NoticeList = (props: IProps) => {
  const {
    list = [],
    pageSize = 5,
    currentPage = 1,
    titleRows = 1,
    descRows = 2,
    onTitleClick,
    onUpdatePage,
  } = props;

  const { prefixCls } = useDesign('header-notify-list');
  const [page, setPage] = useState(currentPage || 1);
  const data = useCreation(() => {
    if (pageSize === false) return [];
    const size = isNumber(pageSize) ? pageSize : 5;
    return list.slice(size * (page - 1), size * page);
  }, [pageSize, list]);
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const pagination = useCreation(() => {
    const size = isNumber(pageSize) ? pageSize : Number(pageSize) && 5;

    if (size > 0 && list && list.length > size) {
      return {
        total: list.length,
        pageSize: size,
        current: page,
        onChange(page: number) {
          setPage(page);
          onUpdatePage?.(page);
        },
      };
    } else {
      return false;
    }
  }, [list, pageSize]);

  const handleTitleClick = (item: ListItem) => {
    onTitleClick?.(item);
  };

  return (
    <List className={prefixCls} bordered pagination={pagination}>
      <>
        {data.map((item, index) => (
          <List.Item className="list-item" key={index}>
            <List.Item.Meta
              title={
                <div className="title">
                  <Typography.Paragraph
                    onClick={() => handleTitleClick(item)}
                    delete={!!item.titleDelete}
                    ellipsis={
                      titleRows && titleRows > 0
                        ? { rows: titleRows, tooltip: !!item.title }
                        : false
                    }
                  >
                    {item.title}
                  </Typography.Paragraph>
                  {item.extra && (
                    <div className="extra">
                      <Tag className="tag" color={item.color}>
                        {item.extra}
                      </Tag>
                    </div>
                  )}
                </div>
              }
              avatar={
                <>
                  {item.avatar ? (
                    <Avatar className="avatar" src={item.avatar} />
                  ) : (
                    <span> {item.avatar}</span>
                  )}
                </>
              }
              description={
                <>
                  {item.description && (
                    <div>
                      <div className="description">
                        <Typography.Paragraph
                          ellipsis={
                            descRows && descRows > 0
                              ? { rows: descRows, tooltip: !!item.description }
                              : false
                          }
                        >
                          {item.description}
                        </Typography.Paragraph>
                      </div>
                      <div className="datetime">{item.datetime}</div>
                    </div>
                  )}
                </>
              }
            ></List.Item.Meta>
          </List.Item>
        ))}
      </>
    </List>
  );
};

export default NoticeList;
