export interface SoapRequest<H, B> {
  "soap:Envelope": SoapEnvelope<H, B>;
}

export interface SoapEnvelope<H, B> {
  "soap:Header": SoapHeader<H>;
  "soap:Body": SoapBody<B>;
}

export type SoapHeader<T> = SoapData<T>;
export type SoapBody<T> = SoapData<T>;

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
    ? SoapMetaData & { value: T[K] }
    : T[K] extends Array<infer U>
    ? (SoapMetaData & SoapData<U>)[]
    : T[K] extends object
    ? SoapMetaData & SoapData<T[K]>
    : SoapMetaData & { value: T[K] };
};

export type SoapMetaData = {
  prefix?: string;
  attributes?: Record<SoapAttribute, string>;
};

export type SoapAttribute = `@_${string}`
