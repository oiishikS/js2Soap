import { RequestHeaders } from "./readerHeader.types";
import { SearchRequestBody } from "./requestModel.types";
import { SoapRequest } from "./soap.types";

export interface APIActions {

  search: SoapRequest<RequestHeaders, SearchRequestBody>;
  
}


