import {
    BufferGeometry,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Plane,
    Vector3,
    DoubleSide
} from "three";

// default planes
export const planes = [
    new Plane(new Vector3(1, 0, 0), -1), //x
    new Plane(new Vector3(0, 1, 0), -1), //y
    new Plane(new Vector3(0, 0, 1), -1) //z
];

/**
 * we override default in threejs
 */
export class PlaneHelperX extends Line {
    plane: any;
    size: number;

    constructor(plane: any, size = 1, hex = 0xffff00) {
        const color = hex;

        const positions = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1];

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
        geometry.computeBoundingSphere();

        super(geometry, new LineBasicMaterial({ color: color, toneMapped: false }));

        this.type = "PlaneHelper";

        this.plane = plane;

        this.size = size;

        const positions2 = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1];

        const geometry2 = new BufferGeometry();
        geometry2.setAttribute("position", new Float32BufferAttribute(positions2, 3));
        geometry2.computeBoundingSphere();

        this.add(
            new Mesh(
                geometry2,
                new MeshBasicMaterial({
                    color: color,
                    opacity: 0.2,
                    transparent: true,
                    depthWrite: false,
                    toneMapped: false
                })
            )
        );
    }

    updateMatrixWorld(force: boolean) {
        let scale = -this.plane.constant;

        if (Math.abs(scale) < 1e-8) scale = 1e-8; // sign does not matter

        this.scale.set(0.5 * this.size, 0.5 * this.size, scale);

        (this.children[0] as any).material.side = DoubleSide; //( scale < 0 ) ? BackSide : FrontSide; // renderer flips side when determinant < 0; flipping not wanted here

        this.lookAt(this.plane.normal);

        super.updateMatrixWorld(force);
    }
}

export const planeHelpers: PlaneHelperX[] = [];
