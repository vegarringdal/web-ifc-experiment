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
    material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
            "void main() {",
            `
            attribute float custom;
            varying float vCustom;
            void main() {
                vCustom = custom;
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
            varying float vCustom;
            void main() {
            if (vCustom > 0.1) discard;
        `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <clipping_planes_fragment>",
            `
          if (vCustom > 0.1) discard;
          #include <clipping_planes_fragment>
        `
        );
    };
    return material;
}
