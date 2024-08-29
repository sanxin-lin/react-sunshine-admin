import { useEffect, useRef } from 'react';
import Iconify from '@purge-icons/generated';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import { isString } from 'lodash-es';

import SvgIcon from './src/SvgIcon';

import './Icon.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  icon?: string;
  color?: string;
  size?: string | number;
  spin?: boolean;
  prefix?: string;
}

const SVG_END_WITH_FLAG = '|svg';

const Icon = (props: IProps) => {
  const {
    icon = '',
    color,
    size = 16,
    spin = false,
    prefix = '',
    className = '',
    ...wrapperProps
  } = props;

  const elRef = useRef<HTMLSpanElement>(null);
  const isSvgIcon = icon.endsWith(SVG_END_WITH_FLAG);
  const svgIcon = icon.replace(SVG_END_WITH_FLAG, '');
  const iconRef = `${prefix ? prefix + ':' : ''}${icon}`;

  const wrapStyle = (() => {
    let fs = size;
    if (isString(size)) {
      fs = parseInt(size, 10);
    }

    return {
      fontSize: `${fs}px`,
      color: color,
      display: 'inline-flex',
    };
  })();

  const update = async () => {
    if (isSvgIcon) return;

    const el = elRef.current;
    if (!el) return;

    const icon = iconRef;
    if (!icon) return;

    const svg = Iconify.renderSVG(icon, {});
    if (svg) {
      el.textContent = '';
      el.appendChild(svg);
    } else {
      const span = document.createElement('span');
      span.className = 'iconify';
      span.dataset.icon = icon;
      el.textContent = '';
      el.appendChild(span);
    }
  };

  useMount(() => {
    update();
  });
  useEffect(() => {
    update();
  }, [icon]);

  const render = () => {
    if (isSvgIcon) {
      return (
        <SvgIcon
          size={size}
          name={svgIcon}
          v-if="isSvgIcon"
          className={`anticon ${className}`}
          spin={spin}
        />
      );
    }

    return (
      <span
        {...wrapperProps}
        ref={elRef}
        className={classNames(`app-iconify anticon ${className}`, {
          'app-iconify-spin': spin,
        })}
        style={wrapStyle}
      ></span>
    );
  };

  return render();
};

export default Icon;
