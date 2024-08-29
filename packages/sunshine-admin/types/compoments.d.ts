import type { ReactNode } from 'react';
import { HTMLAttributes } from 'react';

// type Children = ReactNode | (() => ReactNode);
export interface BaseProps extends Omit<HTMLAttributes<any>, 'title' | 'draggable'> {
  // className?: string;
  children?: ReactNode;
}
