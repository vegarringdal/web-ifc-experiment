import * as WebIFC from "web-ifc/web-ifc-api";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Mesh } from "three";
import { material } from "./material";
import { MeshExtended } from "./MeshExtended";
import { getAllGeometry } from "./getAllGeometry";

export function loadAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI, loadPropertySets: boolean) {
    const { geometries, geometriesWithAlpha, normalMeshId, alphaMeshId } = getAllGeometry(
        modelID,
        ifcAPI,
        loadPropertySets
    );

    let meshWithoutAlpha: MeshExtended;
    let meshWithAlpha: MeshExtended;

    if (geometries) {
        meshWithoutAlpha = new Mesh(
            BufferGeometryUtils.mergeBufferGeometries(geometries, true),
            material
        ) as MeshExtended;
        meshWithoutAlpha.name = "no alpha";
        meshWithoutAlpha.meshID = normalMeshId;
    }

    if (geometriesWithAlpha.length) {
        meshWithAlpha = new Mesh(
            BufferGeometryUtils.mergeBufferGeometries(geometriesWithAlpha, true),
            material
        ) as MeshExtended;
        meshWithAlpha.name = "alpha";
        meshWithAlpha.meshID = alphaMeshId;
    }

    return { meshWithAlpha, meshWithoutAlpha };
}
