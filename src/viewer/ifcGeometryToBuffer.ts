import * as WebIFC from "web-ifc/web-ifc-api";
import { BufferGeometry, BufferAttribute, Color } from "three";

export function ifcGeometryToBuffer(
    vertexData: number[],
    indexData: number[],
    color: WebIFC.Color,
    pickingColor: Color
) {
    const geometry = new BufferGeometry();

    const positions = [];
    const normals = [];
    const colors = [];
    const colorsPicking = [];
    const hidden = [];

    for (let k = 0, lenk = vertexData.length / 6; k < lenk; k++) {
        positions.push(vertexData[k * 6 + 0]);
        positions.push(vertexData[k * 6 + 1]);
        positions.push(vertexData[k * 6 + 2]);

        normals.push(vertexData[k * 6 + 3]);
        normals.push(vertexData[k * 6 + 4]);
        normals.push(vertexData[k * 6 + 5]);

        colors.push(color.x);
        colors.push(color.y);
        colors.push(color.z);
        colors.push(color.w);

        colorsPicking.push(pickingColor.r);
        colorsPicking.push(pickingColor.g);
        colorsPicking.push(pickingColor.b);
        colorsPicking.push(1);

        hidden.push(0);
    }

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3, true));
    geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3, true));
    geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 4, true));
    geometry.setAttribute("hidden", new BufferAttribute(new Float32Array(hidden), 1, true));
    geometry.setAttribute(
        "colorpicking",
        new BufferAttribute(new Float32Array(colorsPicking), 4, true)
    );
    geometry.setIndex(new BufferAttribute(indexData, 1));

    return geometry;
}
