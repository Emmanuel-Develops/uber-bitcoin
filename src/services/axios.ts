import { MAVAPAY_API_KEY, MAVAPAY_URL } from "@/config/process";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: MAVAPAY_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  config.headers["x-api-key"] = MAVAPAY_API_KEY;
  return config;
});

// axiosInstance.interceptors.response.use(
//   async (response) => {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   async (error) => {
//     const statusCode = error.response.status;
//     if (statusCode === 401) {
//       await signOut({ redirect: false });
//       await signIn("github");
//     }
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
