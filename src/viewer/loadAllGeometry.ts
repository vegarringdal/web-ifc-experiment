import * as WebIFC from "web-ifc/web-ifc-api";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Mesh } from "three";
import { materialPicking } from "./materialPicking";
import { material } from "./material";
import { MeshExtended } from "./MeshExtended";
import { getAllGeometry } from "./getAllGeometry";

export function loadAllGeometry(modelID: number, ifcAPI: WebIFC.IfcAPI) {
    const { geometries, geometriesWithAlpha, normalMeshId, alphaMeshId } = getAllGeometry(
        modelID,
        ifcAPI
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
        meshWithoutAlpha.pickable = function () {
            this.material = materialPicking;
        };
        meshWithoutAlpha.unpickable = function () {
            this.material = material;
        };
    }

    if (geometriesWithAlpha.length) {
        meshWithAlpha = new Mesh(
            BufferGeometryUtils.mergeBufferGeometries(geometriesWithAlpha, true),
            material
        ) as MeshExtended;
        meshWithAlpha.name = "alpha";
        meshWithAlpha.meshID = alphaMeshId;
        meshWithAlpha.pickable = function () {
            this.material = materialPicking;
        };
        meshWithAlpha.unpickable = function () {
            this.material = material;
        };
    }

    return { meshWithAlpha, meshWithoutAlpha };
}
