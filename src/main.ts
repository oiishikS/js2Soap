import { randomUUID } from "crypto";
import { RequestHeaders } from "./readerHeader.types";
import { SearchRequest, SearchRequestBody } from "./requestModel.types";
import { SoapBody, SoapEnvelope, SoapHeader } from "./soap.types";

export const getRequest = (): SearchRequest => {
  return {
    "soap:Envelope": {
      "soap:Header": getHeader(),
      "soap:Body": getBody(),
    },
  };
};

const getHeader = (): SoapHeader<RequestHeaders> => ({
  prefix: "sec",
  attributes: { "@_xmlns:wsse": "http://docs.oasis-open.org/wss/" },
  authentication: {
    prefix: "auth",
    attributes: { "@_mustUnderstand": "1" },
    token: {
      prefix: "auth",
      attributes: { "@_tokenType": "UUID" },
      value: randomUUID(),
    },
    keepAlive: {
      prefix: "auth",
      attributes: { "@_unit": "minutes" },
      value: 15,
    },
    createdAt: {
      prefix: "auth",
      attributes: { "@_tz": "UTC" },
      value: new Date().toISOString(),
    },
  },
  session: {
    prefix: "sess",
    attributes: { "@_idType": "GUID" },
    value: randomUUID(),
  },
});

const getBody = (): SoapBody<SearchRequestBody> => ({
  prefix: "req",
  attributes: { "@_xmlns": "http://airindia.com/NDC/Search" },
  origin: {
    prefix: "req",
    attributes: { "@_city": "true" },
    value: "BOM",
  },
  destination: {
    prefix: "req",
    attributes: { "@_city": "true" },
    value: "DEL",
  },
  date: {
    prefix: "req",
    attributes: { "@_format": "yyyy-MM-dd" },
    value: new Date().toISOString(),
  },
  pax: [
    {
      prefix: "pax",
      attributes: { "@_id": "1" },
      paxType: {
        prefix: "pax",
        attributes: { "@_code": "ADT" },
        value: "ADT",
      },
      count: {
        prefix: "pax",
        attributes: { "@_num": "true" },
        value: 1,
      },
    },
    {
      prefix: "pax",
      attributes: { "@_id": "2" },
      paxType: {
        prefix: "pax",
        attributes: { "@_code": "CHD" },
        value: "CHD",
      },
      count: {
        prefix: "pax",
        attributes: { "@_num": "true" },
        value: 1,
      },
    },
  ],
});
