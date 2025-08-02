import { randomUUID } from "crypto";
import { AirShoppingBodySchema, AirShoppingHeaderSchema, AirShoppingRequest } from "./models/request/request.model";
import { NamespacePrefix, SoapBody, SoapHeader, SoapRequest } from "./models/soap/soap.model";


export function requestBuilder<T extends SoapRequest<any, any> = SoapRequest<SoapHeader, SoapBody>>(): T {

    const soapRequest: AirShoppingRequest = {
        "soap:Envelope": {
            attributes: {
                "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                "@_xmlns:wsse": "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd",
                "@_xmlns:n1": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersMessage",
                "@_xmlns:n2": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes",
                "@_xmlns:cns": "http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes"
            },
            "soap:Header": {
                data: {
                    Security: {
                        prefix: NamespacePrefix.WSSE,
                        attributes: { "@_mustUnderstand": "1" },
                        timeCreated: new Date().toISOString(),
                        keepAlive: 15,
                        passWord: "abc",
                    },
                    prefix: NamespacePrefix.WSSE
                },
            },
            "soap:Body": {
                data: {
                    DistributionChain: {
                        prefix: NamespacePrefix.N1,
                        attributes: { "@_id": "Dist001" },
                        key: 2,
                    },
                    Param1: [
                        { prefix: NamespacePrefix.CNS, key: "abc", val: 123 },
                        { prefix: NamespacePrefix.CNS, key: "def", val: 456 },
                    ],
                    Param2: {
                        prefix: NamespacePrefix.CNS,
                        key: "ghi",
                        val: 789,
                    },
                    Param3: 0,
                    prefix: NamespacePrefix.N2
                },
            },
        },
    };
    return soapRequest as T;
}

export function transformForXml(obj: any): any {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        Object.assign(result, transformNode(value, key));
    }

    return result;
}

function transformNode(obj: any, keyName: string): any {
    if (Array.isArray(obj)) {
        return {
            [keyName]: obj.map((item) => transformNode(item, keyName)[Object.keys(transformNode(item, keyName))[0]])
        };
    }

    if (obj && typeof obj === "object") {
        const { prefix, attributes, ...rest } = obj;

        const transformed: Record<string, any> = {};
        for (const [childKey, childVal] of Object.entries(rest)) {
            Object.assign(transformed, transformNode(childVal, childKey));
        }

        if (attributes) {
            for (const [k, v] of Object.entries(attributes)) {
                transformed[`@_${k.replace(/^@_/, "")}`] = v;
            }
        }

        const finalKey = prefix ? `${prefix}:${keyName}` : keyName;
        return { [finalKey]: transformed };
    }

    // primitive
    return { [keyName]: obj };
}







