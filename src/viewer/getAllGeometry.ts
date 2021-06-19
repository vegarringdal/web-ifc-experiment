import { BufferGeometry } from "three";
import * as WebIFC from "web-ifc/web-ifc-api";
import { getCurrentID, getId } from "./colorId";
import { convertToThreeBufferGeometry } from "./convertToThreeBufferGeometry";
import { getAllPropertySets } from "./getAllProperties";
import { propertyMap } from "./propertyMap";

export function getAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI, loadPropertySets: boolean) {
    const flatMeshes = ifcAPI.LoadAllGeometry(modelID);
    const mergeMapAlpha = new Map<string, BufferGeometry[]>();
    const mergeMapNonAlpha = new Map<string, BufferGeometry[]>();
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

            const color = flatMeshGeometry.color;
            const colorID = `${color.x * 255}.${color.y * 255}.${color.z * 255}.${color.w * 255}`;

            if (flatMeshGeometry.color.w === 1) {
                const geometry = convertToThreeBufferGeometry(modelID, ifcAPI, flatMeshGeometry);
                geometry.userData = { id: getId() };
                const x = mergeMapNonAlpha.get(colorID);
                if (!x) {
                    const x = [geometry];
                    mergeMapNonAlpha.set(colorID, x);
                } else {
                    x.push(geometry);
                }
            } else {
                const geometry = convertToThreeBufferGeometry(modelID, ifcAPI, flatMeshGeometry);
                geometry.userData = { id: getId() };
                const x = mergeMapAlpha.get(colorID);
                if (!x) {
                    const x = [geometry];
                    mergeMapAlpha.set(colorID, x);
                } else {
                    x.push(geometry);
                }
            }

            propertyMap.set(getCurrentID(), { properties, color });
        }
    }
    return { mergeMapAlpha, mergeMapNonAlpha };
}
