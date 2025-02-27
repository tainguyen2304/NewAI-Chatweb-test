import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const staleTime = 20000;

const getTimeBySecondAgo = (second: number): Date => {
  const date = new Date();
  date.setSeconds(date.getSeconds() - second);
  return date;
};

const defaultQueryOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime,
    initialDataUpdatedAt: getTimeBySecondAgo(staleTime / 1000).getTime(),
  },
};

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});
