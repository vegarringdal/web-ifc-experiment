import * as WebIFC from "web-ifc/web-ifc-api";

export function getItemProperties(elementID: number, modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const properties = ifcAPI.GetLine(modelID, elementID);
    return properties;
}
