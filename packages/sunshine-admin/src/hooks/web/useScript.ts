import { useState } from 'react';
import { useMount, useUnmount } from 'ahooks';

interface ScriptOptions {
  src: string;
}

export const useScript = (opts: ScriptOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  let script: HTMLScriptElement;

  const promise = new Promise((resolve, reject) => {
    useMount(() => {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = function () {
        setLoading(false);
        setSuccess(true);
        setError(false);
        resolve('');
      };

      script.onerror = function (err) {
        setLoading(false);
        setSuccess(false);
        setError(true);
        reject(err);
      };

      script.src = opts.src;
      document.head.appendChild(script);
    });
  });

  useUnmount(() => {
    script && script.remove();
  });

  return {
    loading,
    error,
    success,
    toPromise: () => promise,
  };
};
