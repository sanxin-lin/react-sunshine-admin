import { useMatches, useSearchParams } from 'react-router-dom';

export const useRouterMatched = () => {
  const matches = useMatches();
  const currentRoute = matches.at(-1)!;
  const query = Object.fromEntries(useSearchParams()[0]);

  return {
    currentRoute,
    path: currentRoute.pathname,
    query,
    handle: currentRoute.handle ?? {},
    matches,
  };
};
