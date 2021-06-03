import { WebGLRenderer, Scene, Color, PerspectiveCamera, DirectionalLight, AmbientLight, Vector2, WebGLRenderTarget, Mesh, Box3, Vector3, } from "three";
// @ts-ignore --types missing atm
import { MathUtils } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshExtended } from "./MeshExtended";
import { propertyMap } from "./propertyMap";
import { readAndParseIFC } from "./readAndParseIFC";
// @ts-ignore --types missing atm
import Stats from "stats.js/src/stats.js";


type listener = { handleEvent: (e: any) => void }
export class ViewController {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: PerspectiveCamera;
    controls: OrbitControls;
    ambientLight: AmbientLight;
    directionalLight2: any;
    directionalLight1: any;
    monitors: Stats;
    threeCanvas: HTMLCanvasElement;



    selectionColor = new Color("red");
    lastSelectedObjectColor = new Color();
    lastSelectedGroup: any;
    lastSelectedId: { id: number; group: number };
    listeners: Set<listener>;

    constructor(canvas: string | HTMLCanvasElement,) {

        this.listeners = new Set<listener>();
        this.__addRender(canvas)
        this.__addScene();
        this.__addCamera();
        this.__addControls();
        this.__addControls();
        this.__addLights();
        this.__addWindowResizer();
        this.__addStats();
        this.__addClickEvent()
        this.animationLoop()

    }

    private animationLoop() {
        if (this.monitors) {
            this.monitors.begin();
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        if (this.monitors) {
            this.monitors.end();
        }

        requestAnimationFrame(() => this.animationLoop());
    }

    private __addRender(canvas: string | HTMLCanvasElement) {
        if (typeof canvas === 'string') {
            this.threeCanvas = document.getElementById("3dview") as HTMLCanvasElement;
            this.renderer = new WebGLRenderer({
                antialias: true,
                canvas: this.threeCanvas,
            });
        } else {
            this.threeCanvas = canvas
            this.renderer = new WebGLRenderer({
                antialias: true,
                canvas: canvas,
            });
        }

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

    }


    private __addScene() {
        this.scene = new Scene();
        this.scene.background = new Color("black");
    }


    private __addCamera() {
        this.camera = new PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.z = 5;
    }

    private __addControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    private __addLights() {
        this.directionalLight1 = new DirectionalLight(0xffeeff, 0.8);
        this.directionalLight1.position.set(1, 1, 1);
        this.scene.add(this.directionalLight1);

        this.directionalLight2 = new DirectionalLight(0xffffff, 0.8);
        this.directionalLight2.position.set(-1, 0.5, -1);
        this.scene.add(this.directionalLight2);

        this.ambientLight = new AmbientLight(0xffffee, 0.25);
        this.scene.add(this.ambientLight);
    }

    private __addWindowResizer() {
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    private __addStats() {
        this.monitors = new Stats();
        this.monitors.showPanel(0);
        this.monitors.dom.style.left = null;
        this.monitors.dom.style.right = "0px";
        (this.monitors.dom.children[1] as HTMLElement).style.display = "block";
        (this.monitors.dom.children[2] as HTMLElement).style.display = "block";
        document.body.appendChild(this.monitors.dom);
    }

    public async readFile(file: File) {
        const { meshWithAlpha, meshWithoutAlpha } = await readAndParseIFC(
            file
        );

        if (meshWithAlpha) this.scene.add(meshWithAlpha);
        if (meshWithoutAlpha) this.scene.add(meshWithoutAlpha);
        if (meshWithAlpha || meshWithoutAlpha) {
            this.fitModelToFrame(meshWithoutAlpha || meshWithAlpha);
        }
    }

    public fitModelToFrame(object: Mesh) {
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

        this.camera.position.copy(
            direction.multiplyScalar(distance).add(boxCenter)
        );
        this.camera.updateProjectionMatrix();
        this.camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

        // set target to newest loaded model
        this.controls.target.copy(boxCenter);
        this.controls.update();
    }



    private __getClickId(mouse: Vector2) {

        // activate our picking material
        this.scene.children.forEach((e: MeshExtended) => {
            if (e.pickable) {
                e.pickable();
            }
        });

        this.camera.setViewOffset(
            this.renderer.domElement.width,
            this.renderer.domElement.height,
            (mouse.x * window.devicePixelRatio) | 0,
            (mouse.y * window.devicePixelRatio) | 0,
            1,
            1
        );

        // render the scene
        let pickingTexture = new WebGLRenderTarget(1, 1);
        const pixelBuffer = new Uint8Array(4);
        this.renderer.setRenderTarget(pickingTexture);
        this.renderer.render(this.scene, this.camera);

        this.renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);

        //interpret the pixel as an ID
        const id =
            (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];

        this.camera.clearViewOffset();

        // deactivate picking material
        this.scene.children.forEach((e: MeshExtended) => {
            // just reset
            if (e.unpickable) {
                e.unpickable();
            }
        })

        this.renderer.setRenderTarget(null);
        return id
    }



    public addEventListener(context: listener) {
        this.listeners.add(context)
    }

    public removeEventListener(context: listener) {
        this.listeners.delete(context)
    }

    private __triggerSelectEvent(id: number) {
        if (id) {
            const selectedID = propertyMap.get(id);
            this.scene.children.forEach((e: MeshExtended) => {
                if (selectedID && e.lookupID === selectedID.id) {
                    const userdata = e.geometry?.userData?.mergedUserData;
                    if (Array.isArray(userdata)) {
                        const data = userdata[selectedID.group]
                        const listeners = Array.from(this.listeners);
                        listeners.forEach((l) => {
                            l.handleEvent({ type: 'modelClick', data: data?.ifcData })
                        })
                    }
                }
            })
        }
    }

    private __addClickEvent() {
        this.threeCanvas.onpointerdown = (event: any) => {

            if (event.button != 0) return;

            const mouse = new Vector2();
            mouse.x = event.clientX;
            mouse.y = event.clientY;

            const id = this.__getClickId(mouse)
            this.__triggerSelectEvent(id);
            const selectedID = propertyMap.get(id);


            // next part is just spagetti still and not very dynamic, on my todo..

            // last color
            this.scene.children.forEach((e: MeshExtended) => {

                if (this.lastSelectedId && e.lookupID === this.lastSelectedId.id) {
                    const group = e.geometry.groups[this.lastSelectedId.group];
                    const colorAtt = e.geometry.attributes.color;
                    const index = e.geometry.index.array;

                    for (let i = group.start; i < group.start + group.count; i++) {
                        const p = index[i] * 4;
                        (colorAtt as any).array[p] = this.lastSelectedObjectColor.r as any;
                        (colorAtt as any).array[p + 1] = this.lastSelectedObjectColor
                            .g as any;
                        (colorAtt as any).array[p + 2] = this.lastSelectedObjectColor
                            .b as any;
                    }
                }
            });

            this.lastSelectedId = null;
            this.lastSelectedGroup = null;
            this.lastSelectedObjectColor = new Color();

            // new color
            this.scene.children.forEach((e: MeshExtended) => {

                if (selectedID && e.lookupID === selectedID.id) {
                    this.lastSelectedId = selectedID;
                    const group = e.geometry.groups[selectedID.group];
                    this.lastSelectedGroup = group;
                    const colorAtt = e.geometry.attributes.color;
                    const index = e.geometry.index.array;

                    {
                        let i = group.start;
                        const x = index[i] * 4;
                        this.lastSelectedObjectColor.r = (colorAtt as any).array[x];
                    }

                    {
                        let i = group.start;
                        const x = index[i] * 4;
                        this.lastSelectedObjectColor.g = (colorAtt as any).array[x + 1];
                    }

                    {
                        let i = group.start;
                        const x = index[i] * 4;
                        this.lastSelectedObjectColor.b = (colorAtt as any).array[x + 2];
                    }

                    for (let i = group.start; i < group.start + group.count; i++) {
                        const p = index[i] * 4;
                        (colorAtt as any).array[p] = this.selectionColor.r as any;
                        (colorAtt as any).array[p + 1] = this.selectionColor.g as any;
                        (colorAtt as any).array[p + 2] = this.selectionColor.b as any;
                    }
                    colorAtt.needsUpdate = true;
                    e.geometry.computeVertexNormals();
                }
            });

            this.renderer.render(this.scene, this.camera);
        }

    }
}