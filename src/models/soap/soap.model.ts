export enum NamespacePrefix {
  SOAP = "soap",
  N1 = "n1",
  N2 = "n2",
  WSSE = "wsse",
  CNS = "cns",
}

type AttributeKey = `@_${string}`;

export type SoapAttributes = Partial<Record<AttributeKey, string>>;

export interface SoapTag {
  prefix: NamespacePrefix;
  attributes?: SoapAttributes;
}


type Soapify<T> = {
  [K in keyof T]:
    T[K] extends (string | number | boolean | Date)
      ? T[K] // <-- allow primitives directly
      : T[K] extends Array<infer U>
        ? (SoapTag & Soapify<U>)[]
        : T[K] extends object
          ? SoapTag & Soapify<T[K]>
          : T[K];
} & SoapTag;



export interface SoapHeader<T extends object = {}> {
  attributes?: SoapAttributes;
  data: Soapify<T>;
}

export interface SoapBody<T extends object = {}> {
  attributes?: SoapAttributes;
  data: Soapify<T>;
}


export interface SoapRequest<H extends object, B extends object> {
  ["soap:Envelope"]: {
    attributes?: SoapAttributes;
    ["soap:Header"]: SoapHeader<H>;
    ["soap:Body"]: SoapBody<B>;
  };
}



