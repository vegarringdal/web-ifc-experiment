import * as WebIFC from "web-ifc/web-ifc-api";
import { ifcGeometryToBuffer } from "./ifcGeometryToBuffer";

export function getBufferGeometry(
    modelID: number,
    ifcAPI: WebIFC.IfcAPI,
    placedGeometry: WebIFC.PlacedGeometry
) {
    const geometry = ifcAPI.GetGeometry(modelID, placedGeometry.geometryExpressID);
    const verts: number[] = ifcAPI.GetVertexArray(
        geometry.GetVertexData(),
        geometry.GetVertexDataSize()
    );
    const indices: number[] = ifcAPI.GetIndexArray(
        geometry.GetIndexData(),
        geometry.GetIndexDataSize()
    );
    const bufferGeometry = ifcGeometryToBuffer(verts, indices);
    return bufferGeometry;
}
