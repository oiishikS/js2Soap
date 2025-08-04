import { defineNameSpaces, ValueOf } from "../globals/helper";
import { RequestHeaders } from "./readerHeader.types";
import { SearchRequestBody } from "./requestModel.types";
import { SoapRequest } from "../globals/soap.types";

export interface API_Actions {

  search: SoapRequest<RequestHeaders, SearchRequestBody>;

}

export const Soap_NameSpaces = defineNameSpaces({
  SOAP: "soap",
  WSSE: "wsse",
  N1: "n1",
  CNS: "cns",
});

export type NameSpacesType = ValueOf<typeof Soap_NameSpaces>;


