import { useQuery } from '@tanstack/react-query';
import { paymentService, PaymentQuery } from '../services/paymentService';
import { queryKeys } from '../queryClient';

export function usePayments(params: PaymentQuery) {
  return useQuery({
    queryKey: queryKeys.payments(params),
    queryFn: () => paymentService.list(params),
    placeholderData: (prev) => prev,
  });
}

export function usePaymentStats() {
  return useQuery({ queryKey: queryKeys.paymentStats, queryFn: paymentService.stats });
}
