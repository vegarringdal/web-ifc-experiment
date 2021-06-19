import { BufferGeometry, BufferAttribute } from "three";

export function ifcGeometryToBuffer(vertexData: number[], indexData: number[]) {
    const geometry = new BufferGeometry();

    const positions = [];
    const normals = [];
    const hidden = [];

    for (let k = 0, lenk = vertexData.length / 6; k < lenk; k++) {
        positions.push(vertexData[k * 6 + 0]);
        positions.push(vertexData[k * 6 + 1]);
        positions.push(vertexData[k * 6 + 2]);

        normals.push(vertexData[k * 6 + 3]);
        normals.push(vertexData[k * 6 + 4]);
        normals.push(vertexData[k * 6 + 5]);

        hidden.push(0);
    }

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3, true));
    geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3, true));
    geometry.setAttribute("hidden", new BufferAttribute(new Float32Array(hidden), 1, true));
    geometry.setIndex(new BufferAttribute(indexData, 1));

    return geometry;
}
