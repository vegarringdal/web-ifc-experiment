import { html, render } from "lit-html";
import {
    AmbientLight,
    Color,
    DirectionalLight,
    PerspectiveCamera,
    Scene,
    Vector2,
    WebGLRenderer,
    WebGLRenderTarget
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { readAndParseIFC } from "viewer/readAndParseIFC";
import Stats from "stats.js";
import { MeshExtended } from "viewer/MeshExtended";
import { propertyMap } from "viewer/propertyMap";
export class AppRoot extends HTMLElement {
    scene: Scene;

    public connectedCallback() {
        render(this.template(), this);

        //Scene
        const scene = new Scene();
        this.scene = scene;

        scene.background = new Color("black");

        //Renderer
        const threeCanvas = document.getElementById("3dview") as HTMLCanvasElement;
        const renderer = new WebGLRenderer({ antialias: true, canvas: threeCanvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        //Camera
        const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        const controls = new OrbitControls(camera, renderer.domElement);

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


        function selectObject(event: any) {

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
            console.log('id:', id);
            const x = propertyMap.get(id);
            camera.clearViewOffset();
          
            scene.children.forEach((e: MeshExtended) => {
              if (e.unpickable) {
                e.unpickable();
              }
          
              if (x && e.lookupID === x.id) {
                console.log(e.geometry.userData.mergedUserData[x.group]);
          
                const g = e.geometry.groups[x.group];
                const colorAtt = e.geometry.attributes.color;
                const showingAtt = e.geometry.attributes.showing;
                const index = e.geometry.index.array;
          
                const c = new Color('red')
                
                for(let i = g.start; i < g.start + g.count;i++ ) {
                    const p = index[i] * 4;
                    colorAtt.setXYZ(p, c.r, c.g, c.b)                 
                }
                colorAtt.needsUpdate = true
                e.geometry.computeVertexNormals();
          
                for(let i = g.start; i < g.start + g.count;i++ ) {
                  const p = index[i];
                  showingAtt.setX(p, 1)
               }
               showingAtt.needsUpdate = true
         
              }
            });
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
          }
          
          threeCanvas.onpointerdown = selectObject;
          
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
