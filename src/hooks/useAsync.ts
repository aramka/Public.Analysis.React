import { useState, useEffect } from 'react';

export function useAsync<T>(serviceFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    serviceFn()
      .then((result) => { setData(result); })
      .catch((err)=>{if(!abortController.signal.aborted) console.error(err);})
      .finally(() => { setLoading(false); });

    return () => {  abortController.abort(); };
  }, []);

  return { data, loading };
}

