import * as WebIFC from "web-ifc/web-ifc-api";
import { Color } from "three";
import { getMeshMatrix } from "./getMeshMatrix";
import { getBufferGeometry } from "./getBufferGeometry";

export function convertToThreeBufferGeometry(
    modelID: number,
    ifcAPI: WebIFC.IfcAPI,
    placedGeometry: WebIFC.PlacedGeometry,
    pickingColor: Color
) {
    const geometry = getBufferGeometry(modelID, ifcAPI, placedGeometry, pickingColor);
    geometry.computeVertexNormals();
    const matrix = getMeshMatrix(placedGeometry.flatTransformation);
    geometry.applyMatrix4(matrix);

    return geometry;
}
