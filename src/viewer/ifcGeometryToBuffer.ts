/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BufferGeometry, BufferAttribute } from "three";
//@ts-ignore
import { computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";
//@ts-ignore
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
//@ts-ignore
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

export function ifcGeometryToBuffer(vertexData: number[], indexData: number[]) {
    const geometry = new BufferGeometry();
    const positions = [];
    const normals = [];

    for (let k = 0, lenk = vertexData.length / 6; k < lenk; k++) {
        positions.push(vertexData[k * 6 + 0]);
        positions.push(vertexData[k * 6 + 1]);
        positions.push(vertexData[k * 6 + 2]);

        normals.push(vertexData[k * 6 + 3]);
        normals.push(vertexData[k * 6 + 4]);
        normals.push(vertexData[k * 6 + 5]);
    }

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3, false));
    geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3, false));
    geometry.setIndex(new BufferAttribute(indexData, 1));

    return geometry;
}
