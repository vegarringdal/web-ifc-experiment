import * as WebIFC from "web-ifc/web-ifc-api";

export function getProperties(modelID: number, ifcAPI: WebIFC.IfcAPI, expressID: number) {
    const properties = ifcAPI.GetLine(modelID, expressID, false) || {};
    // I really only need tis for testing and to be able to query database
    return {
        Tag: properties.Tag,
        expressID: properties.Tag,
        Name: properties.Name,
        ElementType: properties?.constructor?.name
    };
}
