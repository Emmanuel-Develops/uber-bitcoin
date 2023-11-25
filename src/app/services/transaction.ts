import { DEFAULT_TRANSACTION_PER_PAGE } from "@/config/default";
import endpoints from "@/config/endpoints";
import axiosInstance from "@/services/axios";
import { Transaction } from "@/types/transaction";

export const getRecentTransactions = async (): Promise<{
  data: { status: string; data: Transaction[] };
}> => {
  return await axiosInstance.get(endpoints.TRANSACTION.GET_RECENT());
};

export const getTransactions = async (
  page: number,
  limit: number = DEFAULT_TRANSACTION_PER_PAGE,
): Promise<{
  data: { status: string; data: Transaction[] };
}> => {
  return await axiosInstance.get(
    endpoints.TRANSACTION.GET_TRANSACTIONS(page, limit),
  );
};
