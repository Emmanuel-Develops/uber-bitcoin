import { AccountTypes } from "@/config/default";

export type DecodedJwt = {
  sub: string;
  name: string;
  type: keyof typeof AccountTypes;
  iat: number;
};
