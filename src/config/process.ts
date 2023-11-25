import { config } from "dotenv";
import { ConfigError } from "./errors";

config();

export const MAVAPAY_URL =
  process.env.MAVAPAY_URL ?? process.env.NEXT_PUBLIC_MAVAPAY_URL ?? "";
export const MAVAPAY_API_KEY =
  process.env.MAVAPAY_API_KEY ?? process.env.NEXT_PUBLIC_MAVAPAY_API_KEY ?? "";
export const isProd = process.env.NODE_ENV === "production";
export const isDev = process.env.NODE_ENV === "development";

if (!MAVAPAY_URL) {
  throw new ConfigError("MAVAPAY_URL not found");
}
if (!MAVAPAY_API_KEY) {
  throw new ConfigError("MAVAPAY_API_KEY not found");
}
