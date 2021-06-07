import { DoubleSide, MeshStandardMaterial } from "three";

export const material = new MeshStandardMaterial({
    vertexColors: true,
    transparent: true,
    wireframe: false,
    side: DoubleSide
});
material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `
  attribute float hidden;
  varying float vHidden;
  void main() {
    vHidden = hidden;
  `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        varying float vHidden;
        void main() {
        if (vHidden > 0.1) discard;
    `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <clipping_planes_fragment>",
        `
      if (vHidden > 0.1) discard;
      #include <clipping_planes_fragment>
    `
    );
};
