export interface IframeInstance {
  postMessage: (message: any, tragetOrigin: string, transfer?: Transferable[]) => void;
  reload: () => void;
}
