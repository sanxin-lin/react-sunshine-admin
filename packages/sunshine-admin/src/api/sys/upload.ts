import { AxiosProgressEvent } from 'axios';

import { useGlobSetting } from '@/hooks/setting';
import { defHttp } from '@/utils/http';

import { UploadApiResult } from './model/uploadModel';

import { UploadFileParams } from '#/axios';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  );
}
