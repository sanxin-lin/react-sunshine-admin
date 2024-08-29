import { RefObject } from 'react';

import { Nullable } from '#/global';

export type DragBarType = {
  wrap: RefObject<Nullable<HTMLDivElement>>;
};
