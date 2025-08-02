import { requestBuilder, transformForXml } from "./requestBuilder";
import { AirShoppingRequest } from "./models/request/request.model";
import { XMLBuilder, XMLValidator } from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";

const request = requestBuilder<AirShoppingRequest>();

const soapRequest = transformForXml(request);

const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const xml = builder.build(soapRequest);

const isValid = XMLValidator.validate(xml);
console.log("XML Valid:", isValid);

// ✅ Pretty print helper
function prettyPrintXml(xml: string): string {
  const PADDING = "  "; // 2 spaces
  const reg = /(>)(<)(\/*)/g;
  let formatted = "";
  let pad = 0;

  xml.replace(reg, "$1\n$2$3").split("\n").forEach((node) => {
    let indent = 0;
    if (node.match(/^<\/\w/)) {
      if (pad !== 0) pad -= 1;
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    }
    formatted += PADDING.repeat(pad) + node + "\n";
    pad += indent;
  });

  return formatted.trim();
}

// ✅ Pretty print XML and write to output.xml
const prettyXml = prettyPrintXml(xml);
const outputPath = path.join(__dirname, "output.xml");

fs.writeFileSync(outputPath, prettyXml, "utf-8");
console.log(`✅ Pretty XML written to ${outputPath}`);
