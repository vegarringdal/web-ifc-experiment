import * as WebIFC from "web-ifc/web-ifc-api";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Color, Mesh, MeshPhongMaterial } from "three";
import { getAllGeometry } from "./getAllGeometry";
import { propertyMap } from "./propertyMap";

export function loadAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI, loadPropertySets: boolean) {
    const { mergeMapAlpha, mergeMapNonAlpha } = getAllGeometry(modelID, ifcAPI, loadPropertySets);

    const meshWithoutAlphaArray: Mesh[] = [];
    const meshWithAlphaArray: Mesh[] = [];
    if (mergeMapNonAlpha && mergeMapNonAlpha.size) {
        Array.from(mergeMapNonAlpha).forEach(([, geometries]) => {
            const id = geometries[0].userData.id;
            const properties = propertyMap.get(id);
            const color = new Color(properties.color.x, properties.color.y, properties.color.z);
            geometries[0].userData.color = null;
            meshWithoutAlphaArray.push(
                new Mesh(
                    BufferGeometryUtils.mergeBufferGeometries(geometries, true),
                    new MeshPhongMaterial({ color, side: 2 })
                )
            );
        });
    }

    if (mergeMapAlpha && mergeMapAlpha.size) {
        Array.from(mergeMapAlpha).forEach(([, geometries]) => {
            const id = geometries[0].userData.id;
            const properties = propertyMap.get(id);
            const color = new Color(properties.color.x, properties.color.y, properties.color.z);
            const material = new MeshPhongMaterial({ color, transparent: true, side: 2 });

            material.opacity = properties.color.w;
            meshWithAlphaArray.push(
                new Mesh(BufferGeometryUtils.mergeBufferGeometries(geometries, true), material)
            );
        });
    }

    return { meshWithAlphaArray, meshWithoutAlphaArray };
}
