import endpoints from "@/config/endpoints";
import axiosInstance from "@/services/axios";
import { Profile } from "@/types/user";
import { Wallet } from "@/types/wallet";

export const getWallets = async (): Promise<{
  status: boolean;
  data?: Wallet[];
}> => {
  try {
    const res = await axiosInstance.get(endpoints.WALLET.GETWALLET());
    return { status: true, data: res.data.data };
  } catch (error) {
    return { status: false };
  }
};
