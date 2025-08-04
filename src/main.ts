import { Soap_NameSpaces } from "./request/constants";
import { RequestBuilder } from "./request/requestBuilder";
import { SoapRequestBuilder } from "./globals/builder";
import { XMLBuilder } from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";



const request = new RequestBuilder().getRequestByAction("search").build();

const xml = new XMLBuilder({attributeNamePrefix: "@_", ignoreAttributes: false, format: true}).build(request)

const outputPath = path.join(__dirname, "output.xml");

fs.writeFileSync(outputPath, xml, "utf-8");