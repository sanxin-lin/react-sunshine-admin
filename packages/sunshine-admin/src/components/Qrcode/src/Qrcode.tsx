import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { useMount } from 'ahooks';
import { toDataURL } from 'qrcode';

import { downloadByUrl } from '@/utils/file/download';

import { toCanvas } from './qrcodePlus';
import type {
  LogoType,
  QrCodeActionType,
  QrcodeDoneEventParams,
  QRCodeRenderersOptions,
} from './types';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  value?: string | any[];
  options?: QRCodeRenderersOptions | null;
  width?: number;
  logo?: Partial<LogoType> | string;
  tag?: 'canvas' | 'img';

  onDone?: (data: QrcodeDoneEventParams) => boolean;
  onError?: (error: any) => boolean;
}

const Qrcode = forwardRef<QrCodeActionType, IProps>((props, ref) => {
  const {
    className = '',
    options,
    width = 200,
    logo = '',
    tag = 'canvas',
    value,
    onError,
    onDone,
    ...wrapperProps
  } = props;

  //   const wrapRef = useRef<HTMLCanvasElement | HTMLImageElement | null>(null);
  const wrapRef = useRef<any>(null);
  const createQrcode = async () => {
    try {
      const renderValue = String(value);
      const wrapEl = wrapRef.current;

      if (!wrapEl) return;

      if (tag === 'canvas') {
        const url: string = await toCanvas({
          canvas: wrapEl,
          width,
          logo: logo as any,
          content: renderValue,
          options: options || {},
        });
        onDone?.({ url, ctx: (wrapEl as HTMLCanvasElement).getContext('2d') });
        return;
      }

      if (tag === 'img') {
        const url = await toDataURL(renderValue, {
          errorCorrectionLevel: 'H',
          width,
          ...options,
        });
        (wrapEl as HTMLImageElement).src = url;
        onDone?.({ url });
      }
    } catch (e) {
      onError?.(e);
    }
  };

  /**
   * file download
   */
  const download = (fileName?: string) => {
    let url = '';
    const wrapEl = wrapRef.current;
    if (wrapEl instanceof HTMLCanvasElement) {
      url = wrapEl.toDataURL();
    } else if (wrapEl instanceof HTMLImageElement) {
      url = wrapEl.src;
    }
    if (!url) return;
    downloadByUrl({
      url,
      fileName,
    });
  };

  useMount(() => {
    createQrcode();
  });

  useEffect(() => {
    createQrcode();
  }, [props]);

  useImperativeHandle(ref, () => ({
    download,
  }));

  return (
    <>
      {tag === 'canvas' ? (
        <canvas {...wrapperProps} className={className} ref={wrapRef} />
      ) : (
        <img {...wrapperProps} className={className} ref={wrapRef} />
      )}
    </>
  );
});

export default Qrcode;
