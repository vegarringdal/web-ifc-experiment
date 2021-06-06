import * as WebIFC from "web-ifc/web-ifc-api";
import { propertyMap } from "./propertyMap";
import { getNewMeshId } from "./getNewMeshId";
import { convertToThreeBufferGeometry } from "./convertToThreeBufferGeometry";
import { Color } from "three";
import { getCurrentColorId, getNewColorId } from "./colorId";

export function getAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const flatMeshes = ifcAPI.LoadAllGeometry(modelID);
    const geometries = [];
    const geometriesWithAlpha = [];
    const normalMeshId = getNewMeshId();
    const alphaMeshId = getNewMeshId();
    const color = new Color();
    for (let i = 0; i < flatMeshes.size(); i++) {
        const flatMesh = flatMeshes.get(i);
        const productId = flatMesh.expressID;
        const flatMeshGeometries = flatMesh.geometries;
        const properties = ifcAPI.GetLine(modelID, productId, false);
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
                geometry.userData.id = productId;
                geometry.userData.ifcData = properties;
                geometries.push(geometry);
            } else {
                const geometry = convertToThreeBufferGeometry(
                    modelID,
                    ifcAPI,
                    flatMeshGeometry,
                    colorID
                );
                geometry.userData.id = productId;
                geometry.userData.ifcData = properties;
                geometriesWithAlpha.push(geometry);
            }

            propertyMap.set(getCurrentColorId(), {
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
