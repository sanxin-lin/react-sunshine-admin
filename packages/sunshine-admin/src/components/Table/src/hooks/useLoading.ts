import { useEffect, useState } from 'react';
import { BasicTableProps } from '../types/table';

export const useLoading = (inputLoading: BasicTableProps['loading']) => {
  const [loading, setLoading] = useState(inputLoading);

  useEffect(() => {
    setLoading(inputLoading);
  }, [inputLoading]);

  return {
    loading,
    setLoading,
  };
};
