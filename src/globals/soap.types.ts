export type SoapAttribute = `@_${string}`;

export type SoapMetaData = {
  prefix?: string; 
  attributes?: Record<SoapAttribute, string>;
};

export type SoapTag = {
  prefix?: string
}

export type PrimitiveType =
  | number
  | string
  | boolean
  | null
  | undefined
  | bigint
  | symbol
  | Date;

export type SoapData<T> = SoapMetaData & {
  [K in keyof T]: T[K] extends PrimitiveType
    ? SoapTag & { value: T[K] }
    : T[K] extends Array<infer U>
    ? (SoapTag & SoapData<U>)[]
    : T[K] extends object
    ? SoapMetaData & SoapData<T[K]>
    : SoapMetaData & { value: T[K] };
};

export type SoapHeader<T> = SoapData<T>;
export type SoapBody<T> = SoapData<T>;

export interface SoapRequest<H, B> {
  "soap:Envelope": {
     attributes?: Record<SoapAttribute, string>;
    "soap:Header": SoapHeader<H>;
    "soap:Body": SoapBody<B>;
  };
}
