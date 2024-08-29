import antdLocale from 'antd/locale/en_US';

import { genMessage } from '../helper';

import { Recordable } from '#/global';

const modules = import.meta.glob('./en/**/*.{json,ts,js}', { eager: true });
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'en'),
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
