import antdLocale from 'antd/locale/zh_CN';
import { merge } from 'lodash-es';

import { genMessage } from '../helper';

import { Recordable } from '#/global';

const modules = import.meta.glob('./zh-CN/**/*.{json,ts,js}', { eager: true });

export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'zh-CN'),
    antdLocale: {
      ...antdLocale,
      DatePicker: merge(
        antdLocale.DatePicker,
        genMessage(modules as Recordable<Recordable>, 'zh-CN').antdLocale.DatePicker,
      ),
    },
  },
};
