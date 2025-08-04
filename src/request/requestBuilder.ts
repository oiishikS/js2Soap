import { randomUUID } from "crypto";
import { RequestHeaders } from "./readerHeader.types";
import { SearchRequest, SearchRequestBody } from "./requestModel.types";
import { SoapHeader, SoapBody } from "../globals/soap.types";
import { Soap_NameSpaces, NameSpacesType, API_Actions } from "./constants";
import { SoapRequestBuilder } from "../globals/builder";


export class RequestBuilder extends SoapRequestBuilder<API_Actions>{
  
  constructor() {
    super(Soap_NameSpaces);
  }

  getRequestByAction<Action extends keyof API_Actions>(action: Action): this {
    switch (action) {
      case "search":
        this.request = this.buildSearchRequest() as API_Actions[Action];
        return this
      default:
        return this
    }
  }

  private buildSearchRequest(): SearchRequest {
    return {
      "soap:Envelope": {
        attributes: {
          "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/"
        },
        "soap:Header": this.getHeaders(),
        "soap:Body": this.getSearchRequestBody(),
      },
    };
  }

  private getHeaders(): SoapHeader<RequestHeaders> {
    return {
      prefix: Soap_NameSpaces.WSSE,
      attributes: { "@_xmlns:wsse": "http://docs.oasis-open.org/wss/" },
      authentication: {
        prefix: Soap_NameSpaces.WSSE,
        attributes: { "@_mustUnderstand": "1" },
        token: {
          prefix: Soap_NameSpaces.WSSE,
          value: randomUUID(),
        },
        keepAlive: {
          prefix: Soap_NameSpaces.WSSE,
          value: 15,
        },
        createdAt: {
          prefix: Soap_NameSpaces.WSSE,
          value: new Date().toISOString(),
        },
      },
      session: {
        prefix: Soap_NameSpaces.WSSE,
        value: randomUUID(),
      },
    };
  }

  private getSearchRequestBody(): SoapBody<SearchRequestBody> {
    return {
      prefix: Soap_NameSpaces.N1,
      attributes: { 
        "@_xmlns:n1": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersMessage" ,
        "@_xmlns:cns": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes"
      },
      origin: {
        prefix: Soap_NameSpaces.CNS,
        value: "DEL",
      },
      destination: {
        prefix: Soap_NameSpaces.CNS,
        value: "BOM",
      },
      date: {
        prefix: Soap_NameSpaces.CNS,
        value: new Date().toDateString(),
      },
      pax: [
        {
          prefix: Soap_NameSpaces.CNS,
          paxType: {
            prefix: Soap_NameSpaces.CNS,
            value: "ADT",
          },
          count: {
            prefix: Soap_NameSpaces.CNS,
            value: 1,
          },
        },
        {
          prefix: Soap_NameSpaces.CNS,
          paxType: {
            prefix: Soap_NameSpaces.CNS,
            value: "CHD"
          },
          count: {
            prefix:Soap_NameSpaces.CNS,
            value:1
          }
        }
      ],
    };
  }
}
