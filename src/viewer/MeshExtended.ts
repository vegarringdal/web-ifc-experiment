import { Mesh, BufferGeometry, MeshLambertMaterial } from "three";

export type MeshExtended = Mesh<BufferGeometry, MeshLambertMaterial> & {
    pickable: () => void;
    unpickable: () => void;
    meshID: number;
};
