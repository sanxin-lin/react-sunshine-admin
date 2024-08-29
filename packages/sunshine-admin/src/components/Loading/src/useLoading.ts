// import Loading from './Loading';
// import { createElement, RefObject, useEffect } from 'react';
// import { LoadingProps } from './types';
// import { useMount, useReactive } from 'ahooks';
// import { useEarliest } from '@/hooks/utils/useEarliest';
// import { uniqueId } from 'lodash-es';
// import { render } from 'react-dom';
// import { createRoot } from 'react-dom/client';
// import { Spin } from 'antd';
// export const useLoading = (
//   props?: Partial<LoadingProps>,
//   target?: RefObject<HTMLElement>,
//   wait = false,
// ) => {
//   const uid = useEarliest(() => `loading__${uniqueId()}`);
//   const data = useReactive({
//     tip: '',
//     loading: false,
//     uid: uid.current,
//     ...props,
//   });

//   const getTarget = () => {
//     return target?.current ?? document.body;
//   };

//   const getLoadingEle = () => {
//     const _target = getTarget();
//     const loadingEle = _target.querySelector(`#${uid.current}`);
//     return loadingEle;
//   };

//   useMount(() => {
//     createRoot(createElement());
//   });

//   const open = () => {
//     const _target = getTarget();
//   };
// };
