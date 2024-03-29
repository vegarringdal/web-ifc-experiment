import * as WebIFC from "web-ifc/web-ifc-api";

export function getPropertiesFromIfcLineWithExpressID(
    modelID: number,
    ifcAPI: WebIFC.IfcAPI,
    expressID: number
) {
    const properties = ifcAPI.GetLine(modelID, expressID, false) || {};
    // I really only need tis for testing and to be able to query database
    return {
        Tag: properties.Tag,
        expressID: properties.expressID,
        Name: properties.Name,
        ElementType: properties?.constructor?.name
    };
}
