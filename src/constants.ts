import { defineNameSpaces, ValueOf } from "./helper";
import { RequestHeaders } from "./readerHeader.types";
import { SearchRequestBody } from "./requestModel.types";
import { SoapRequest } from "./soap.types";

export interface NDCAPIActions {
    
  search: SoapRequest<RequestHeaders, SearchRequestBody>;

}

export const AmadeusNDCNameSpaces = defineNameSpaces({
  SOAP: "soap",
  WSSE: "wsse",
  N1: "n1",
  CNS: "cns",
});

export type AmadeusNDCNameSpaceType = ValueOf<typeof AmadeusNDCNameSpaces>;


