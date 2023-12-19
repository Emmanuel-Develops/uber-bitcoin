import endpoints from "@/config/endpoints";
import axiosInstance from "@/services/axios";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
} from "@chakra-ui/react";
import Image from "next/image";
import { UberPay } from "./components/UberPay";
import { Order } from "@/types";

export type getOrderProps = {
  id: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankCode: string;
};

export default async function Home() {
  const bankCodes = await axiosInstance
    .get(endpoints.BANK.GET_BANK_CODE())
    .then((res) => res.data.data)
    .catch((err) => []);

  const getQuote = async ({ amount }: { amount: string }) => {
    "use server";
    const data = {
      amount,
      sourceCurrency: "BTC",
      targetCurrency: "NGN",
      paymentMethod: "LIGHTNING",
    };
    try {
      const res = await axiosInstance.post("quote", data);
      return { success: true, data: res.data.data };
    } catch (error: any) {
      console.error(error.response);
      return { success: false, message: error?.response?.data?.message };
    }
  };

  const getOrder = async ({
    id,
    bankAccountNumber,
    bankAccountName,
    bankCode,
  }: getOrderProps) => {
    "use server";
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

  const getOrderById = async (orderId: string) => {
    "use server";
    try {
      const res = await axiosInstance.get(`order?id=${orderId}`);
      return { success: true, data: res.data.data };
    } catch (error: any) {
      console.error(error.response);
      return { success: false, message: error.response.data.message };
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 md:p-24">
      <div className="w-full max-w-[700px] border-2 border-[#EFF0F6] p-[38px]">
        <h2 className="font-semibold py-4 text-xl text-center">
          Pay for an Uber
        </h2>
        <div>
          <UberPay
            bankCodes={bankCodes}
            getQuote={getQuote}
            getOrder={getOrder}
            getOrderById={getOrderById}
          />
        </div>
      </div>
    </main>
  );
}
