import { AxiosError } from 'axios';
import { QueryClient, UseQueryOptions, UseMutationOptions, DefaultOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { PromiseValue } from 'type-fest';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> = PromiseValue<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type InfiniteQueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseInfiniteQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;
