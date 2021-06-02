import { DoubleSide, MeshBasicMaterial } from "three";

export const materialPicking = new MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    side: DoubleSide
});
materialPicking.onBeforeCompile = (shader) => {
    shader.uniforms.picking = { value: true };
    shader.vertexShader = shader.vertexShader.replace("#include <clipping_planes_pars_vertex>", "");
    shader.vertexShader = shader.vertexShader.replace("#include <uv_vertex>", "");
    shader.vertexShader = shader.vertexShader.replace("#include <uv2_vertex>", "");
    shader.vertexShader = shader.vertexShader.replace("#include <color_vertex>", "");

    shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `

    uniform bool picking;
    attribute vec4 colorpicking;
    attribute float hidden;
    varying float vHidden;
    
    #include <clipping_planes_pars_vertex>
    
    void main() {
      #include <uv_vertex>
      #include <uv2_vertex>
      vHidden = hidden;
  
      #if defined( USE_COLOR_ALPHA )
	      vColor = vec4( 1.0 );
      #elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	      vColor = vec3( 1.0 );
      #endif
      #ifdef USE_COLOR
        if(picking){
          vColor *= colorpicking;
        } else{
          vColor *= color;
        }
	      
      #endif
      #ifdef USE_INSTANCING_COLOR
	      vColor.xyz *= instanceColor.xyz;
      #endif
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
