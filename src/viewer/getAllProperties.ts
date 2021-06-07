import * as WebIFC from "web-ifc/web-ifc-api";

export function getAllPropertySets(modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const lines = ifcAPI.GetLineIDsWithType(modelID, WebIFC.IFCRELDEFINESBYPROPERTIES);
    const properties = {};
    for (let i = 0; i < lines.size(); i++) {
        const relID = lines.get(i);
        const rel = ifcAPI.GetLine(modelID, relID);
        const relatedItems = rel?.RelatedObjects;
        const relatedPropertyValue = rel?.RelatingPropertyDefinition?.value;

        if (relatedPropertyValue) {
            if (Array.isArray(relatedItems)) {
                relatedItems.forEach((relID) => {
                    if (!properties[relID.value]) {
                        properties[relID.value] = [relatedPropertyValue];
                    } else {
                        properties[relID.value].push(relatedPropertyValue);
                    }
                });
            } else {
                const relValue = relatedItems?.value;
                if (relValue) {
                    properties[relValue].push(relatedPropertyValue);
                }
                throw "Im unsure if this can happend";
            }
        }
    }
    const keys = Object.keys(properties);
    keys.forEach((id: string) => {
        const ids = properties[id];
        properties[id] = ids.map((x: number) => ifcAPI.GetLine(modelID, x, true));
    });
    return properties;
}
