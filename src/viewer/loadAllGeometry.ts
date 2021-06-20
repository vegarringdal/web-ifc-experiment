/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as WebIFC from "web-ifc/web-ifc-api";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Color, Mesh } from "three";
import { getAllGeometry } from "./getAllGeometry";
import { getMaterial } from "./material";
import { propertyMap } from "./propertyMap";

export function loadAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const { mergeMapAlpha, mergeMapNonAlpha } = getAllGeometry(modelID, ifcAPI);

    const meshWithoutAlphaArray: Mesh[] = [];
    const meshWithAlphaArray: Mesh[] = [];
    if (mergeMapNonAlpha && mergeMapNonAlpha.size) {
        Array.from(mergeMapNonAlpha).forEach(([, geometries]) => {
            const id = geometries[0].userData.id;
            const properties = propertyMap.get(id);
            const mesh = new Mesh(
                BufferGeometryUtils.mergeBufferGeometries(geometries, true),
                getMaterial(
                    new Color(properties.color.x, properties.color.y, properties.color.z),
                    properties.color.w
                )
            );
            //@ts-ignore
            mesh.geometry.computeBoundsTree();
            meshWithoutAlphaArray.push(mesh);
        });
    }

    if (mergeMapAlpha && mergeMapAlpha.size) {
        Array.from(mergeMapAlpha).forEach(([, geometries]) => {
            const id = geometries[0].userData.id;

            const properties = propertyMap.get(id);

            const mesh = new Mesh(
                BufferGeometryUtils.mergeBufferGeometries(geometries, true),
                getMaterial(
                    new Color(properties.color.x, properties.color.y, properties.color.z),
                    properties.color.w
                )
            );
            //@ts-ignore
            mesh.geometry.computeBoundsTree();
            meshWithAlphaArray.push(mesh);
        });
    }

    return { meshWithAlphaArray, meshWithoutAlphaArray };
}
