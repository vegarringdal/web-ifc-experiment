import { BufferGeometry, Vector4 } from "three";
import * as WebIFC from "web-ifc/web-ifc-api";
import { getNewCollectionId } from "./collectionId";
import { collectionMap } from "./collectionMap";
import { getId } from "./colorId";
import { convertToThreeBufferGeometry } from "./convertToThreeBufferGeometry";
import { getPropertiesFromIfcLineWithExpressID } from "./getPropertiesFromIfcLineWithExpressID";
import { propertyMap } from "./propertyMap";

export function getAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const flatMeshes = ifcAPI.LoadAllGeometry(modelID);
    const mergeMap = new Map<string, BufferGeometry[]>();
    // this can take a lot of memory..

    for (let i = 0; i < flatMeshes.size(); i++) {
        const flatMesh = flatMeshes.get(i);
        const expressID = flatMesh.expressID;
        const flatMeshGeometries = flatMesh.geometries;
        const properties = getPropertiesFromIfcLineWithExpressID(modelID, ifcAPI, expressID);

        // collection is to collect all meshes that belongs to same express id
        const collection = [];
        const collectionID = getNewCollectionId();

        for (let j = 0; j < flatMeshGeometries.size(); j++) {
            const flatMeshGeometry = flatMeshGeometries.get(j);
            const color = new Vector4(
                flatMeshGeometry.color.x,
                flatMeshGeometry.color.y,
                flatMeshGeometry.color.z,
                flatMeshGeometry.color.w
            );
            // color id will only be used to know what to merged together
            const colorID = `${color.x}.${color.y}.${color.z}.${color.w}`;
            // using custom id, since we want to allow user to load many ifc files, expressID isnt unique
            const id = getId();
            const geometry = convertToThreeBufferGeometry(modelID, ifcAPI, flatMeshGeometry);
            geometry.userData = { id: id };
            let x = mergeMap.get(colorID);
            if (!x) {
                x = [geometry];
                mergeMap.set(colorID, x);
            } else {
                x.push(geometry);
            }

            // pushing id and group index, so I dont haveto loop all groups, <id, groupindex>
            collection.push(id, x.length - 1);

            // we add the collectionID so its easy to get it later
            // color vec3 is to compare/find correct merge geometry
            propertyMap.set(id, { properties, color, collectionID });
        }

        collectionMap.set(collectionID, collection);
    }
    return mergeMap;
}
