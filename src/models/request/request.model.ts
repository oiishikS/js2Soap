import { SoapRequest } from "../soap/soap.model";

export interface AirShoppingHeaderSchema {
  Security: {
    timeCreated: string;
    keepAlive: number;
    passWord: string;
  };
}

export interface AirShoppingBodySchema {
  DistributionChain: { key: number };
  Param1: { key: string; val: any }[];
  Param2: { key: string; val: any };
  Param3: number;
}

export type AirShoppingRequest = SoapRequest<AirShoppingHeaderSchema,AirShoppingBodySchema>;
