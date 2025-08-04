import { SoapRequest } from "../globals/soap.types";
import { RequestHeaders } from "./readerHeader.types";

export interface SearchRequestBody {
  origin: Airport;
  destination: Airport;
  date: string;
  filters?: Filters;
  pax: Pax[];
}

export type Airport = Uppercase<string>;

export interface Filters {
  onlyNonStop?: boolean;
  airline?: "indigo" | "spicejet" | "akasa";
}

export interface Pax {
  paxType: "ADT" | "CHD" | "INF";
  count: number;
}

export type SearchRequest = SoapRequest<RequestHeaders, SearchRequestBody>;
