import endpoints from "@/config/endpoints";
import axiosInstance from "@/services/axios";
import { Profile } from "@/types/user";

export const getProfile = async (): Promise<{
  data: { status: string; data: Profile };
}> => {
  return await axiosInstance.get(endpoints.USER.GET_USER());
};
