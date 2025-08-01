"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fast_xml_parser_1 = require("fast-xml-parser");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const obj = {
    Headers: {
        session: (0, crypto_1.randomUUID)(),
        token: {
            timeCreated: new Date(),
            keepAlive: 15,
            passWord: "pass123",
            prefix: "wsse",
            attributes: {
                xmls: "www.google.com",
            }
        },
        prefix: "n1",
        attributes: {
            xmls: "www.google.com",
        }
    },
    Body: {
        Param1: [
            {
                key: "key1",
                val: 1,
                prefix: "cns",
                attributes: {
                    xmls: "www.google.com",
                }
            },
            {
                key: "key2",
                val: 2,
                prefix: "cns"
            }
        ],
        Param2: {
            key: "key3",
            val: 3,
            prefix: "cns"
        },
        Param3: 0,
        attributes: {
            xmls: "www.google.com",
        },
        prefix: "n2"
    },
    prefix: "n1"
};
const updatedObj = updateObjWithPrefixAndAttributes(obj);
const wrappedObj = {
    "soap:Envelope": {
        "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
        "@_xmlns:n1": "http://testnamespace/n1",
        "@_xmlns:n2": "http://testnamespace/n2",
        "@_xmlns:wsse": "http://testnamespace/wsse",
        "@_xmlns:cns": "http://testnamespace/cns",
        ...updatedObj
    }
};
const builder = new fast_xml_parser_1.XMLBuilder({
    attributeNamePrefix: "@_",
    ignoreAttributes: false,
});
const xml = builder.build(wrappedObj);
const outputPath = path.join(__dirname, "output.xml");
// Write XML to file (overwrites if it already exists)
fs.writeFileSync(outputPath, xml, "utf-8");
console.log(`✅ XML written to ${outputPath}`);
function updateObjWithPrefixAndAttributes(obj) {
    if (!obj || typeof obj !== "object")
        return obj;
    // 1. Handle attributes → convert to @_
    if (obj.attributes) {
        for (const [k, v] of Object.entries(obj.attributes)) {
            obj[`@_${k}`] = v;
        }
        delete obj.attributes;
    }
    // 2. Extract and remove prefix
    const currentPrefix = obj.prefix;
    delete obj.prefix;
    // 3. Process children
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (Array.isArray(val)) {
            obj[key] = val.map((item) => typeof item === "object" ? updateObjWithPrefixAndAttributes(item) : item);
        }
        else if (typeof val === "object" && val !== null) {
            obj[key] = updateObjWithPrefixAndAttributes(val);
        }
    }
    // 4. Apply prefix to this node’s children keys
    if (currentPrefix) {
        const newObj = {};
        for (const [key, val] of Object.entries(obj)) {
            // Only prefix element keys (not attributes)
            if (!key.startsWith("@_")) {
                newObj[`${currentPrefix}:${key}`] = val;
            }
            else {
                newObj[key] = val;
            }
        }
        return newObj;
    }
    return obj;
}
