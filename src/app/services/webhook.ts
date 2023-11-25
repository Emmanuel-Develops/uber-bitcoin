import endpoints from "@/config/endpoints";
import axiosInstance from "@/services/axios";
import { Profile } from "@/types/user";

export const updateWebhook = async (body: any) => {
  return await axiosInstance.post(endpoints.WEBHOOK.UPDATE_WEBHOOK(), body);
};
