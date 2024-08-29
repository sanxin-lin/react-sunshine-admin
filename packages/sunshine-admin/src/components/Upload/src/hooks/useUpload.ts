import { useLocale } from '@/hooks/web/useLocale';
import { useCreation } from 'ahooks';

export function useUploadType({
  accept,
  helpText,
  maxNumber,
  maxSize,
}: {
  accept: string[];
  helpText: string;
  maxNumber: number;
  maxSize: number;
}) {
  const { t } = useLocale();
  // 文件类型限制
  const getAccept = useCreation(() => {
    if (accept && accept.length > 0) {
      return accept;
    }
    return [];
  }, [accept]);
  const getStringAccept = useCreation(() => {
    return getAccept
      .map((item) => {
        if (item.indexOf('/') > 0 || item.startsWith('.')) {
          return item;
        } else {
          return `.${item}`;
        }
      })
      .join(',');
  }, [getAccept]);

  // 支持jpg、jpeg、png格式，不超过2M，最多可选择10张图片，。
  const getHelpText = useCreation(() => {
    if (helpText) {
      return helpText;
    }
    const helpTexts: string[] = [];
    if (accept.length > 0) {
      helpTexts.push(t('component.upload.accept', { value: accept.join(',') }));
    }

    if (maxSize) {
      helpTexts.push(t('component.upload.maxSize', { value: maxSize }));
    }

    if (maxNumber && maxNumber !== Infinity) {
      helpTexts.push(t('component.upload.maxNumber', { value: maxNumber }));
    }
    return helpTexts.join('，');
  }, [helpText, accept, maxNumber, maxSize]);
  return { getAccept, getStringAccept, getHelpText };
}
