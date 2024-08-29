import { useState } from 'react';

export const useTranslation = () => {
  const [isPending, setIsPending] = useState(false);
  const start = async (cb: () => Promise<any>) => {
    try {
      setIsPending(true);
      await cb();
      setIsPending(false);
    } catch (e) {
      setIsPending(false);
    }
  };

  return [isPending, start] as const;
};
