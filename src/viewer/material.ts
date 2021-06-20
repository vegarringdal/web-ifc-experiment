import { Color, DoubleSide, MeshLambertMaterial } from "three";

export function getMaterial(color: Color, opacity: number) {
    const material = new MeshLambertMaterial({
        transparent: opacity === 1 ? false : true,
        wireframe: false,
        side: DoubleSide,
        color: color,
        opacity: opacity
    });
    // todo, add some custom shader
    return material;
}
