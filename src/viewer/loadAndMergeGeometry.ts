/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as WebIFC from "web-ifc/web-ifc-api";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Color, Mesh } from "three";
import { getAllGeometry } from "./getAllGeometry";
import { getMaterial } from "./material";
import { propertyMap } from "./propertyMap";
import { MeshExtended } from "./MeshExtended";
//@ts-ignore
import { acceleratedRaycast } from "three-mesh-bvh";
//@ts-ignore
Mesh.prototype.raycast = acceleratedRaycast;

export function loadAndMergeGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const mergeMap = getAllGeometry(modelID, ifcAPI);

    const meshesPerColor: Mesh[] = [];
    if (mergeMap && mergeMap.size) {
        Array.from(mergeMap).forEach(([, geometries]) => {
            const id = geometries[0].userData.id;
            const properties = propertyMap.get(id);
            const mesh = new Mesh(
                mergeBufferGeometries(geometries, true),
                getMaterial(
                    new Color(properties.color.x, properties.color.y, properties.color.z),
                    properties.color.w
                )
            );
            //@ts-ignore
            mesh.geometry.computeBoundsTree();
            (mesh as MeshExtended).meshType = "generated";
            meshesPerColor.push(mesh);
        });
    }

    return meshesPerColor;
}
