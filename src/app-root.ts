import { html, render } from "lit-html";
import {
    AmbientLight,
    Box3,
    Color,
    DirectionalLight,
    PerspectiveCamera,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
    WebGLRenderTarget,
    MathUtils,
    Mesh
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { readAndParseIFC } from "viewer/readAndParseIFC";
import Stats from "stats.js";
import { MeshExtended } from "viewer/MeshExtended";
import { propertyMap } from "viewer/propertyMap";
export class AppRoot extends HTMLElement {
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    controls: OrbitControls;

    selectionColor = new Color('yellow')
    lastSelectedObjectColor= new Color()
    lastSelectedGroup: any;
    lastSelectedId: number;

    public connectedCallback() {
        render(this.template(), this);

        //Scene
        const scene = new Scene();
        this.scene = scene;

        scene.background = new Color("black");

        //Renderer
        const threeCanvas = document.getElementById("3dview") as HTMLCanvasElement;
        const renderer = new WebGLRenderer({ antialias: true, canvas: threeCanvas });
        this.renderer = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        //Camera
        const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera = camera;
        camera.position.z = 5;

        // controls
        const controls = new OrbitControls(camera, renderer.domElement);
        this.controls = controls;

        //Lights
        const directionalLight1 = new DirectionalLight(0xffeeff, 0.8);
        directionalLight1.position.set(1, 1, 1);
        scene.add(directionalLight1);
        const directionalLight2 = new DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-1, 0.5, -1);
        scene.add(directionalLight2);
        const ambientLight = new AmbientLight(0xffffee, 0.25);
        scene.add(ambientLight);

        //Window resize support
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        //Monitoring
        const stats = new Stats();
        stats.showPanel(0);
        stats.dom.style.left = null;
        stats.dom.style.right = "0px";
        (stats.dom.children[1] as HTMLElement).style.display = "block";
        (stats.dom.children[2] as HTMLElement).style.display = "block";
        document.body.appendChild(stats.dom);

        //Animation
        function AnimationLoop() {
            stats.begin();
            controls.update();
            renderer.render(scene, camera);
            stats.end();
            requestAnimationFrame(AnimationLoop);
        }
        AnimationLoop();


        threeCanvas.onpointerdown = (event: any) => {

            // this does very little atm

            if (event.button != 0) return;
          
            const mouse = new Vector2();
            mouse.x = event.clientX;
            mouse.y = event.clientY;
          
            if (event.ctrlKey) {
              debugger;
            }
          
            scene.children.forEach((e: MeshExtended) => {
              if (e.pickable) {
                e.pickable();
              }
            });
          
            camera.setViewOffset(
              renderer.domElement.width,
              renderer.domElement.height,
              (mouse.x * window.devicePixelRatio) | 0,
              (mouse.y * window.devicePixelRatio) | 0,
              1,
              1
            );
          
            // render the scene
            let pickingTexture = new WebGLRenderTarget(1, 1);
            const pixelBuffer = new Uint8Array(4);
            renderer.setRenderTarget(pickingTexture);
            renderer.render(scene, camera);
          
            renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);
          
            //interpret the pixel as an ID
            const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
            const selectedID = propertyMap.get(id);
            camera.clearViewOffset();
            

             // new color
    /*          scene.children.forEach((e: MeshExtended) => {

              // just reset
              if (e.unpickable) {
                e.unpickable();
              }
          
              if (this.lastSelectedId && e.lookupID === this.lastSelectedId) {
               
                const group = e.geometry.groups[this.lastSelectedGroup];
                const colorAtt = e.geometry.attributes.color;
                const index = e.geometry.index.array;       
               
                for(let i = group.start; i < group.start + group.count;i++ ) {
                    const p = index[i] * 4;
                    colorAtt.setXYZ(p, this.lastSelectedObjectColor.r, this.lastSelectedObjectColor.g, this.lastSelectedObjectColor.b)                 
                }
                colorAtt.needsUpdate = true
                
    
          
          
         
              }
            }); */
          


            // new color
            scene.children.forEach((e: MeshExtended) => {
              if (e.unpickable) {
                e.unpickable();
              }
              this.lastSelectedId = selectedID
              if (selectedID && e.lookupID === selectedID.id) {
               
                const group = e.geometry.groups[selectedID.group];
                this.lastSelectedGroup = group;
                const colorAtt = e.geometry.attributes.color;
                const index = e.geometry.index.array;       
                
                {
                  let i = group.start
                  const r = index[i] * 4;
                  this.lastSelectedObjectColor.r = r
                }

                {
                  let i = group.start+1
                  const g = index[i] * 4;
                  this.lastSelectedObjectColor.g = g
                }

                {
                  let i = group.start+2
                  const b = index[i] * 4;
                  this.lastSelectedObjectColor.b = b
                }
                console.log(selectedID)
                console.log(index[group.start] * 4, colorAtt.array[index[group.start] * 4], colorAtt.array[index[group.start+1] * 4], colorAtt.array[index[group.start+1] * 4])
                for(let i = group.start; i < group.start + group.count;i++ ) {
                    const p = index[i] * 4;
                    colorAtt.setXYZ(p, this.selectionColor.r, this.selectionColor.g, this.selectionColor.b)                 
                }
                colorAtt.needsUpdate = true        
                e.geometry.computeVertexNormals();
         
              }
            });
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
          }
          
     
          
    }


    fitModelToFrame(object: Mesh) {
      const box = new Box3().setFromObject(object);
      const boxSize = box.getSize(new Vector3()).length();
      const boxCenter = box.getCenter(new Vector3());

      const halfSizeToFitOnScreen = boxSize * 0.5;
      const halfFovY = MathUtils.degToRad(this.camera.fov * 0.5);
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

      const direction = new Vector3()
          .subVectors(this.camera.position, boxCenter)
          .multiply(new Vector3(1, 0, 1))
          .normalize();

      this.camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
      this.camera.updateProjectionMatrix();
      this.camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

      // set target to newest loaded model
      this.controls.target.copy(boxCenter);
      this.controls.update();
  }

    public template() {
        return html` <label class="inline-block p-2 m-2 bg-indigo-300 z-10 relative">
                <input
                    class="hidden"
                    @change=${async (e: any) => {
                        const { meshWithAlpha, meshWithoutAlpha } = await readAndParseIFC(
                            e.target.files[0]
                        );
                        if (meshWithAlpha) this.scene.add(meshWithAlpha);
                        if (meshWithoutAlpha) this.scene.add(meshWithoutAlpha);
                        if(meshWithAlpha || meshWithoutAlpha){
                          this.fitModelToFrame(meshWithoutAlpha || meshWithAlpha)
                        }
                        
                    }}
                    type="file"
                    value=""
                />
                open file
            </label>

            <!--  keep it simple for now, just use entire screen -->
            <canvas class="top-0 absolute w-full h-full" id="3dview"></canvas>`;
    }
}
