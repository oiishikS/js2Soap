import { randomUUID } from "crypto";
import { APIActions } from "./constants";
import { RequestHeaders } from "./readerHeader.types";
import { SearchRequest, SearchRequestBody } from "./requestModel.types";
import { SoapBody, SoapHeader, SoapRequest } from "./soap.types";


export class SoapRequestBuilder {


    constructor(){

    }

    getRequestByAction<Action extends keyof APIActions>(action: Action): APIActions[Action] {
        switch (action) {
            case "search":
                return this.buildSearchRequest() as APIActions[Action];
            default:
                throw new Error(`Unsupported action: ${action}`);
        }
    }

    private buildSearchRequest() : SearchRequest {
        
        const searchRequest : SearchRequest = {

            "soap:Envelope": {
                "soap:Header": this.getHeaders(),
                "soap:Body": this.getSearchRequestBody()
            }
        }

        return searchRequest;
    }

    private getHeaders() : SoapHeader<RequestHeaders> {
        
        const headers: SoapHeader<RequestHeaders> = {
            prefix: "wsse",
            attributes: { "@_xmlns:wsse": "http://docs.oasis-open.org/wss/" },
            authentication: {
                prefix: "wsse",
                attributes: { "@_mustUnderstand": "1" },
                token: {
                    prefix: "wsse",
                    attributes: { "@_Type": "UUID" },
                    value: randomUUID()
                },
                keepAlive: {
                    prefix: "wsse",
                    attributes: { "@_unit": "minutes" },
                    value: 15
                },
                createdAt: {
                    prefix: "wsse",
                    attributes: { "@_tz": "UTC" },
                    value: new Date().toISOString()
                }
            },
            session: {
                prefix: "wsse",
                attributes: { "@_idType": "GUID" },
                value: randomUUID()
            }
        };

        return headers;
    }

    private getSearchRequestBody(): SoapBody<SearchRequestBody> {

        const searchRequestBody: SoapBody<SearchRequestBody> = {
            prefix: "n1",
            attributes: { "@_xmlns:n1": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersMessage" },
            origin: {
                prefix: "cns",
                attributes: { "@_city": "true" },
                value: "DEL"
            },
            destination: {
                prefix: "cns",
                attributes: { "@_city": "true" },
                value: "BOM"
            },
            date: {
                prefix: "cns",
                attributes: { "@_format": "yyyy-MM-dd" },
                value: new Date().toDateString()
            },
            pax: [
                {
                    prefix: "cns",
                    attributes: { "@_id": "P1" },
                    paxType: {
                        prefix: "cns",
                        attributes: { "@_code": "ADT" },
                        value: "ADT"
                    },
                    count: {
                        prefix: "cns",
                        attributes: { "@_num": "true" },
                        value: 1
                    }
                },
                {
                    prefix: "cns",
                    attributes: { "@_id": "P2" },
                    paxType: {
                        prefix: "cns",
                        attributes: { "@_code": "CHD" },
                        value: "CHD"
                    },
                    count: {
                        prefix: "cns",
                        attributes: { "@_num": "true" },
                        value: 1
                    }
                }
            ]
        };


        return searchRequestBody;
    }
}