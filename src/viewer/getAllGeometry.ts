import { BufferGeometry } from "three";
import * as WebIFC from "web-ifc/web-ifc-api";
import { getCurrentID, getId } from "./colorId";
import { convertToThreeBufferGeometry } from "./convertToThreeBufferGeometry";
import { getProperties } from "./getProperties";
import { propertyMap } from "./propertyMap";

export function getAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const flatMeshes = ifcAPI.LoadAllGeometry(modelID);
    const mergeMap = new Map<string, BufferGeometry[]>();
    // this can take a lot of memory..

    for (let i = 0; i < flatMeshes.size(); i++) {
        const flatMesh = flatMeshes.get(i);
        const expressID = flatMesh.expressID;
        const flatMeshGeometries = flatMesh.geometries;
        const properties = getProperties(modelID, ifcAPI, expressID);

        for (let j = 0; j < flatMeshGeometries.size(); j++) {
            const flatMeshGeometry = flatMeshGeometries.get(j);
            const color = flatMeshGeometry.color;
            const colorID = `${color.x}.${color.y}.${color.z}.${color.w}`;

            const geometry = convertToThreeBufferGeometry(modelID, ifcAPI, flatMeshGeometry);
            geometry.userData = { id: getId() };
            const x = mergeMap.get(colorID);
            if (!x) {
                const x = [geometry];
                mergeMap.set(colorID, x);
            } else {
                x.push(geometry);
            }

            propertyMap.set(getCurrentID(), { properties, color });
        }
    }
    return mergeMap;
}
