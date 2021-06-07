import * as WebIFC from "web-ifc/web-ifc-api";
import { propertyMap } from "./propertyMap";
import { getNewMeshId } from "./getNewMeshId";
import { convertToThreeBufferGeometry } from "./convertToThreeBufferGeometry";
import { Color } from "three";
import { getCurrentColorId, getNewColorId } from "./colorId";
import { getAllPropertySets } from "./getAllProperties";

export function getAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI, loadPropertySets: boolean) {
    const flatMeshes = ifcAPI.LoadAllGeometry(modelID);
    const geometries = [];
    const geometriesWithAlpha = [];
    const normalMeshId = getNewMeshId();
    const alphaMeshId = getNewMeshId();
    const color = new Color();

    // this can take a lot of memory..
    let propertySet = {};
    if (loadPropertySets) {
        propertySet = getAllPropertySets(modelID, ifcAPI);
    }

    for (let i = 0; i < flatMeshes.size(); i++) {
        const flatMesh = flatMeshes.get(i);
        const expressID = flatMesh.expressID;
        const flatMeshGeometries = flatMesh.geometries;
        const properties = ifcAPI.GetLine(modelID, expressID, false) || {};
        properties.PropertySet = propertySet[expressID] || [];

        for (let j = 0; j < flatMeshGeometries.size(); j++) {
            const flatMeshGeometry = flatMeshGeometries.get(j);

            // generate color id
            // we will use this to reference objects later
            const colorID = color.setHex(getNewColorId());

            if (flatMeshGeometry.color.w === 1) {
                const geometry = convertToThreeBufferGeometry(
                    modelID,
                    ifcAPI,
                    flatMeshGeometry,
                    colorID
                );
                geometries.push(geometry);
            } else {
                const geometry = convertToThreeBufferGeometry(
                    modelID,
                    ifcAPI,
                    flatMeshGeometry,
                    colorID
                );
                geometriesWithAlpha.push(geometry);
            }

            propertyMap.set(getCurrentColorId(), {
                expressID,
                properties,
                meshID: flatMeshGeometry.color.w === 1 ? normalMeshId : alphaMeshId,
                group:
                    flatMeshGeometry.color.w === 1
                        ? geometries.length - 1
                        : geometriesWithAlpha.length - 1
            });
        }
    }
    return { geometries, geometriesWithAlpha, normalMeshId, alphaMeshId };
}
