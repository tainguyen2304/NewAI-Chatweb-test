import { useQuery } from '@tanstack/react-query';
import { userOnlineKeys, userOnlineService } from '../services';
import { useMemo } from 'react';

const useUserOnline = () => {
  const { data, isLoading, isFetching, isRefetching } = useQuery({
    queryKey: userOnlineKeys.getAllUser(),
    queryFn: userOnlineService.getAllUser,
  });

  const isLoadingUserOnline = useMemo(
    () => isLoading || isFetching || isRefetching,
    [isFetching, isLoading, isRefetching]
  );

  return { userOnlines: data?.data ?? [], isLoadingUserOnline };
};

export default useUserOnline;
