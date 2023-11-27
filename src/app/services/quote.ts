import axiosInstance from "@/services/axios";
import { getOrderProps } from "../page";
import { Order, Transaction } from "@/types";

export const getQuote = async ({ amount }: { amount: string }) => {
  const data = {
    amount,
    sourceCurrency: "BTC",
    targetCurrency: "NGN",
    paymentMethod: "LIGHTNING",
  };
  try {
    const res = await axiosInstance
    .post("quote", data);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    console.log(error.response);
    return { success: false, message: error?.response?.data?.message };
  }
};

export const getOrder = async ({
  id,
  bankAccountNumber,
  bankAccountName,
  bankCode,
}: getOrderProps) => {
  const params = new URLSearchParams()
  params.append("autopayout", "true")
  params.append("id", id)
  params.append("bankAccountNumber", bankAccountNumber)
  params.append("bankAccountName", bankAccountName)
  params.append("bankCode", bankCode)

  const queryParams = params.toString()
  try {

    const res = await axiosInstance.get(`quote/accept?${queryParams}`);
    return { success: true, data: res.data.data as Order };
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`order?id=${orderId}`);
    return { success: true, data: res.data.data };
  } catch (error: any) {
    console.log(error.response);
    return { success: false, message: error.response.data.message };
  }
};

export const getTxnByOrderId = async (orderId: string) => {
  try {
    const res = await axiosInstance.get<{status: string, data: Transaction[]}>(`transaction?orderId=${orderId}`);
    console.log(res.data)
    return { success: true, data: res.data.data };
  } catch (error: any) {
    console.log(error.response);
    return { success: false, message: error.response.data.message };
  }
};
