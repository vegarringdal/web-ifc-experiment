import * as WebIFC from "web-ifc/web-ifc-api";
import { propertyMap } from "./propertyMap";
import { getNewMeshId } from "./getNewMeshId";
import { convertToThreeBufferGeometry } from "./convertToThreeBufferGeometry";
import { getCurrentColorId } from "./colorId";
import { getAllPropertySets } from "./getAllProperties";
import { getNewCollectionId } from "./collectionId";

export function getAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI, loadPropertySets: boolean) {
    const flatMeshes = ifcAPI.LoadAllGeometry(modelID);
    const geometries = [];
    const geometriesWithAlpha = [];
    const normalMeshId = getNewMeshId();
    const alphaMeshId = getNewMeshId();

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

        const collectionID = getNewCollectionId();

        for (let j = 0; j < flatMeshGeometries.size(); j++) {
            const flatMeshGeometry = flatMeshGeometries.get(j);

            // generate color id
            // we will use this to reference objects later

            if (flatMeshGeometry.color.w === 1) {
                const geometry = convertToThreeBufferGeometry(modelID, ifcAPI, flatMeshGeometry);
                geometries.push(geometry);
            } else {
                const geometry = convertToThreeBufferGeometry(modelID, ifcAPI, flatMeshGeometry);
                geometriesWithAlpha.push(geometry);
            }

            propertyMap.set(getCurrentColorId(), {
                expressID,
                properties,
                collectionID,
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
