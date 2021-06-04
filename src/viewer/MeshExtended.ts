import { Mesh, BufferGeometry, MeshStandardMaterial } from "three";

export type MeshExtended = Mesh<BufferGeometry, MeshStandardMaterial> & {
    pickable: () => void;
    unpickable: () => void;
    meshID: number;
};
