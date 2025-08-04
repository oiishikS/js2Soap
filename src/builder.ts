import { SoapRequest, SoapHeader, SoapBody } from "./soap.types";


export abstract class SoapRequestBuilder<Actions extends { [K in keyof Actions]: SoapRequest<any, any> }> {

  protected readonly namespaces: Record<string, string>;

  protected request: Actions[keyof Actions] | null = null;

  constructor(schema: Record<string, string>) {
    this.namespaces = schema;
    this.request = null!
  }

  abstract getRequestByAction<Action extends keyof Actions>(action: Action): this

  build() {

    if (!this.request) {
      throw new Error("No request has been built yet");
    }

    const transform = (obj: any, parentKey?: string): any => {
      if (obj === null || obj === undefined) return obj;

      if (Array.isArray(obj)) {
        // repeat the same tag for each array element
        return { [parentKey!]: obj.map((item) => transform(item, parentKey)) };
      }

      if (typeof obj === "object") {
        const { prefix, attributes, value, ...rest } = obj;

        // primitive value with prefix
        if ("value" in obj) {
          const key = prefix && parentKey ? `${prefix}:${parentKey}` : parentKey!;
          return { [key]: value };
        }

        // nested object with attributes
        const result: any = { ...(attributes || {}) };

        for (const [childKey, childVal] of Object.entries(rest)) {
          Object.assign(result, transform(childVal, childKey));
        }

        return parentKey ? { [parentKey]: result } : result;
      }

      return obj;
    };

    return transform(this.request);
  }



}
