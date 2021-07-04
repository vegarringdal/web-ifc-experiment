import { Mesh, BufferGeometry, MeshLambertMaterial } from "three";

export type MeshExtended = Mesh<BufferGeometry, MeshLambertMaterial> & {
    meshType: string;
    meshID: number;
};
