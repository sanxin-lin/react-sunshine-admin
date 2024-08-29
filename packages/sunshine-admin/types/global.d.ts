export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Recordable<T = any> = Record<string, T>;
export type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};
export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
export interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
export type TargetContext = '_self' | '_blank';
export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type IntervalHandle = ReturnType<typeof setInterval>;

export type Merge<O extends object, T extends object> = {
  [K in keyof O | keyof T]: K extends keyof T ? T[K] : K extends keyof O ? O[K] : never;
};

export type MergeAll<T extends object[], R extends object = {}> = T extends [
  infer F extends object,
  ...infer Rest extends object[],
]
  ? MergeAll<Rest, Merge<R, F>>
  : R;

export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

/**
 * 任意类型的函数
 */
type AnyFunction = AnyNormalFunction | AnyPromiseFunction;

type LabelValueOptions = {
  label: string;
  value: any;
  [key: string]: string | number | boolean;
}[];
