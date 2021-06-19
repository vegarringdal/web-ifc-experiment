import * as WebIFC from "web-ifc/web-ifc-api";
import { getMeshMatrix } from "./getMeshMatrix";
import { getBufferGeometry } from "./getBufferGeometry";

export function convertToThreeBufferGeometry(
    modelID: number,
    ifcAPI: WebIFC.IfcAPI,
    placedGeometry: WebIFC.PlacedGeometry
) {
    const geometry = getBufferGeometry(modelID, ifcAPI, placedGeometry);
    geometry.computeVertexNormals();
    const matrix = getMeshMatrix(placedGeometry.flatTransformation);
    geometry.applyMatrix4(matrix);

    return geometry;
}
