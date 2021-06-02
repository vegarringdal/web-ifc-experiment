import { DoubleSide, MeshStandardMaterial } from "three";

export const material = new MeshStandardMaterial({
  vertexColors: true,
  transparent: true,
  side: DoubleSide
});
material.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader.replace(
    "void main() {",
    `
  attribute float showing;
  varying float vShowing;
  void main() {
    vShowing = showing;
  `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "void main() {",
    /*glsl*/`
        varying float vShowing;
        void main() {
        if (vShowing > 0.1) discard;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <clipping_planes_fragment>",
    `
      if (vShowing > 0.1) discard;
      #include <clipping_planes_fragment>
    `
  );
};
