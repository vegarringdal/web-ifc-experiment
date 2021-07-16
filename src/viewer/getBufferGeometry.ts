import * as WebIFC from "web-ifc/web-ifc-api";
import { ifcVertexDataToGeometryAttributes } from "./ifcVertexDataToGeometryAttributes";

export function getBufferGeometry(
    modelID: number,
    ifcAPI: WebIFC.IfcAPI,
    placedGeometry: WebIFC.PlacedGeometry
) {
    const geometry = ifcAPI.GetGeometry(modelID, placedGeometry.geometryExpressID);
    const verts: number[] = ifcAPI.GetVertexArray(
        geometry.GetVertexData(),
        geometry.GetVertexDataSize()
    ) as any;
    const indices: number[] = ifcAPI.GetIndexArray(
        geometry.GetIndexData(),
        geometry.GetIndexDataSize()
    ) as any;
    const bufferGeometry = ifcVertexDataToGeometryAttributes(verts, indices);
    return bufferGeometry;
}
