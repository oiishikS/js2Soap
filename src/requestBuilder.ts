import { randomUUID } from "crypto";
import { RequestHeaders } from "./readerHeader.types";
import { SearchRequest, SearchRequestBody } from "./requestModel.types";
import { SoapHeader, SoapBody } from "./soap.types";
import { AmadeusNDCNameSpaces, AmadeusNDCNameSpaceType, NDCAPIActions } from "./constants";
import { SoapRequestBuilder } from "./builder";


export class NDCRequestBuilder extends SoapRequestBuilder<NDCAPIActions>{
  
  constructor() {
    super(AmadeusNDCNameSpaces);
  }

  getRequestByAction<Action extends keyof NDCAPIActions>(action: Action): this {
    switch (action) {
      case "search":
        this.request = this.buildSearchRequest() as NDCAPIActions[Action];
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
      prefix: AmadeusNDCNameSpaces.WSSE,
      attributes: { "@_xmlns:wsse": "http://docs.oasis-open.org/wss/" },
      authentication: {
        prefix: AmadeusNDCNameSpaces.WSSE,
        attributes: { "@_mustUnderstand": "1" },
        token: {
          prefix: AmadeusNDCNameSpaces.WSSE,
          value: randomUUID(),
        },
        keepAlive: {
          prefix: AmadeusNDCNameSpaces.WSSE,
          value: 15,
        },
        createdAt: {
          prefix: AmadeusNDCNameSpaces.WSSE,
          value: new Date().toISOString(),
        },
      },
      session: {
        prefix: AmadeusNDCNameSpaces.WSSE,
        value: randomUUID(),
      },
    };
  }

  private getSearchRequestBody(): SoapBody<SearchRequestBody> {
    return {
      prefix: AmadeusNDCNameSpaces.N1,
      attributes: { 
        "@_xmlns:n1": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersMessage" ,
        "@_xmlns:cns": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes"
      },
      origin: {
        prefix: AmadeusNDCNameSpaces.CNS,
        value: "DEL",
      },
      destination: {
        prefix: AmadeusNDCNameSpaces.CNS,
        value: "BOM",
      },
      date: {
        prefix: AmadeusNDCNameSpaces.CNS,
        value: new Date().toDateString(),
      },
      pax: [
        {
          prefix: AmadeusNDCNameSpaces.CNS,
          paxType: {
            prefix: AmadeusNDCNameSpaces.CNS,
            value: "ADT",
          },
          count: {
            prefix: AmadeusNDCNameSpaces.CNS,
            value: 1,
          },
        },
        {
          prefix: AmadeusNDCNameSpaces.CNS,
          paxType: {
            prefix: AmadeusNDCNameSpaces.CNS,
            value: "CHD"
          },
          count: {
            prefix:AmadeusNDCNameSpaces.CNS,
            value:1
          }
        }
      ],
    };
  }
}
