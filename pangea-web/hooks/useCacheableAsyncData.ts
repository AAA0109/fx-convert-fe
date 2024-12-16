import { useQuery, UseQueryResult } from '@tanstack/react-query';
type UseCacheableAsyncDataResult<T> = UseQueryResult<T> & {
  refetchData: () => Promise<T | undefined>;
};
// Generic hook
export function useCacheableAsyncData<T>(
  queryKey: string,
  fetchData: () => Promise<T>,
): UseCacheableAsyncDataResult<T> {
  const { data, isLoading, refetch, isFetching } = useQuery<T>({
    queryKey: [queryKey],
    queryFn: fetchData,
    staleTime: Infinity,
  });

  const refetchData = async (): Promise<T | undefined> => {
    const newData = await refetch();
    if (JSON.stringify(newData.data) !== JSON.stringify(data)) {
      // newData is different from the cached data
      return newData.data;
    }
    return data;
  };

  return {
    data,
    isLoading,
    refetchData,
    isFetching,
  } as UseCacheableAsyncDataResult<T>;
}
