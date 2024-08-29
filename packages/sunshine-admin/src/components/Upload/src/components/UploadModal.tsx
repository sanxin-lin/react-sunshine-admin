import { useMessage } from '@/hooks/web/useMessage';
import { isFunction, get } from 'lodash-es';
import { warn } from '@/utils/log';
import { useLocale } from '@/hooks/web/useLocale';
import { useUploadType } from '../hooks/useUpload';
import { UploadContainerProps } from '../types/props';
import { UploadResultStatus, FileItem } from '../types';
import { checkImgType, getBase64WithFile } from '../helper';
import { useCreation } from 'ahooks';
import { useState } from 'react';
import { buildUUID } from '@/utils/uuid';
import { BasicModal, useModal } from '@/components/Modal';

import './UploadModal.less';
import { Alert, Button, Upload } from 'antd';
import FileList from './FileList';

const UploadModal = (props: UploadContainerProps) => {
  const {
    accept = [],
    helpText = '',
    maxSize = 2,
    onDelete,
    api = null,
    uploadParams = {},
    name = 'file',
    filename = null,
    resultField = '',
    maxNumber = 1,
    previewFileList = [],
    multiple = false,
    onChange,
  } = props;

  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const { t } = useLocale();

  const { createMessage } = useMessage();
  const [register, { closeModal }] = useModal();

  const { getStringAccept, getHelpText } = useUploadType({
    accept,
    helpText,
    maxNumber,
    maxSize,
  });

    // TODO BasicTable
    const columns = ();
    const actionColumn = createActionColumn(handleRemove);

  const isSelectFile = useCreation(() => {
    return (
      fileList.length > 0 && !fileList.every((item) => item.status === UploadResultStatus.SUCCESS)
    );
  }, [fileList]);

  const okButtonProps = useCreation(() => {
    const someSuccess = fileList.some((item) => item.status === UploadResultStatus.SUCCESS);
    return {
      disabled: loading || fileList.length === 0 || !someSuccess,
    };
  }, [loading, fileList]);

  const uploadBtnText = useCreation(() => {
    const someError = fileList.some((item) => item.status === UploadResultStatus.ERROR);
    return loading
      ? t('component.upload.uploading')
      : someError
        ? t('component.upload.reUploadFailed')
        : t('component.upload.startUpload');
  }, [fileList, loading]);

  // 上传前校验
  function beforeUpload(file: File) {
    const { size, name } = file;
    // 设置最大值，则判断
    if (maxSize && file.size / 1024 / 1024 >= maxSize) {
      createMessage.error(t('component.upload.maxSizeMultiple', { value: maxSize }));
      return false;
    }

    const commonItem = {
      uuid: buildUUID(),
      file,
      size,
      name,
      percent: 0,
      type: name.split('.').pop(),
    };
    // 生成图片缩略图
    if (checkImgType(file)) {
      // beforeUpload，如果异步会调用自带上传方法
      // file.thumbUrl = await getBase64(file);
      getBase64WithFile(file).then(({ result: thumbUrl }) => {
        setFileList((pre) => [
          ...pre,
          {
            thumbUrl,
            ...commonItem,
          },
        ]);
      });
    } else {
      setFileList((pre) => [...pre, commonItem]);
    }
    return false;
  }

  // 删除
  function handleRemove(record: FileItem) {
    const index = fileList.findIndex((item) => item.uuid === record.uuid);
    index !== -1 && fileList.splice(index, 1);
    setLoading(fileList.some((item) => item.status === UploadResultStatus.UPLOADING));
    onDelete?.(record);
  }

  async function uploadApiByItem(item: FileItem) {
    if (!api || !isFunction(api)) {
      return warn('upload api must exist and be a function');
    }
    try {
      item.status = UploadResultStatus.UPLOADING;
      const ret = await api?.(
        {
          data: {
            ...(uploadParams || {}),
          },
          file: item.file,
          name,
          filename,
        },
        function onUploadProgress(progressEvent: ProgressEvent) {
          const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          item.percent = complete;
        },
      );
      const { data } = ret;
      item.status = UploadResultStatus.SUCCESS;
      item.response = data;
      if (resultField) {
        // 适配预览组件而进行封装
        item.response = {
          code: 0,
          message: 'upload Success!',
          url: get(ret, resultField),
        };
      }
      return {
        success: true,
        error: null,
      };
    } catch (e) {
      console.log(e);
      item.status = UploadResultStatus.ERROR;
      return {
        success: false,
        error: e,
      };
    }
  }

  // 点击开始上传
  async function handleStartUpload() {
    if (fileList.length + previewFileList.length > maxNumber) {
      return createMessage.warning(t('component.upload.maxNumber', { value: maxNumber }));
    }
    try {
      setLoading(true);
      // 只上传不是成功状态的
      const uploadFileList =
        fileList.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
      const data = await Promise.all(
        uploadFileList.map((item) => {
          return uploadApiByItem(item);
        }),
      );
      setLoading(false);
      // 生产环境:抛出错误
      const errorList = data.filter((item: any) => !item.success);
      if (errorList.length > 0) throw errorList;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  //   点击保存
  function handleOk() {
    if (fileList.length > maxNumber) {
      return createMessage.warning(t('component.upload.maxNumber', { value: maxNumber }));
    }
    if (loading) {
      return createMessage.warning(t('component.upload.saveWarn'));
    }
    const _fileList: string[] = [];

    for (const item of fileList) {
      const { status, response } = item;
      if (status === UploadResultStatus.SUCCESS && response) {
        _fileList.push(response.url);
      }
    }
    // 存在一个上传成功的即可保存
    if (_fileList.length <= 0) {
      return createMessage.warning(t('component.upload.saveError'));
    }
    setFileList([]);
    closeModal();
    onChange?.(_fileList);
  }

  // 点击关闭：则所有操作不保存，包括上传的
  async function handleCloseFunc() {
    if (!loading) {
      setFileList([]);
      return true;
    } else {
      createMessage.warning(t('component.upload.uploadWait'));
      return false;
    }
  }

  return (
    <BasicModal
      width="800px"
      title={t('component.upload.upload')}
      okText={t('component.upload.save')}
      register={register}
      onOk={handleOk}
      closeFunc={handleCloseFunc}
      maskClosable={false}
      keyboard={false}
      className="upload-modal"
      okButtonProps={okButtonProps}
      cancelButtonProps={{ disabled: loading }}
      centerFooter={
        <Button
          onClick={handleStartUpload}
          color="success"
          disabled={!isSelectFile}
          loading={loading}
        >
          {uploadBtnText}
        </Button>
      }
    >
      <div className="upload-modal-toolbar">
        <Alert message={getHelpText} type="info" banner className="upload-modal-toolbar__text" />

        <Upload
          accept={getStringAccept}
          multiple={multiple}
          beforeUpload={beforeUpload}
          showUploadList={false}
          className="upload-modal-toolbar__btn"
        >
          <Button type="primary">{t('component.upload.choose')}</Button>
        </Upload>
      </div>
      <FileList dataSource={fileList} columns={colu} />
    </BasicModal>
  );
};

export default UploadModal;
