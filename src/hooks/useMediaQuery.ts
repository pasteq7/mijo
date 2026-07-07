import { useCallback, useSyncExternalStore } from 'react';

function readMediaQuery(query: string): boolean {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => undefined;

    const mediaQueryList = window.matchMedia(query);

    mediaQueryList.addEventListener('change', onStoreChange);

    return () => mediaQueryList.removeEventListener('change', onStoreChange);
  }, [query]);

  const getSnapshot = useCallback(() => readMediaQuery(query), [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
