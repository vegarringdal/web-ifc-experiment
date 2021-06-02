import { Matrix4 } from "three";

export function getMeshMatrix(matrix: number[] | ArrayLike<number>) {
    const mat = new Matrix4();
    mat.fromArray(matrix);
    return mat;
}
