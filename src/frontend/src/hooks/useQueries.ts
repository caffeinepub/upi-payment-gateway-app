import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetUPIId() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['upiId'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUpiId();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableUPIApps() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['upiApps'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSupportedUpiApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitUTR() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (utr: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitUtr(utr);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
  });
}
