import {
    WebGLRenderer,
    Scene,
    Color,
    PerspectiveCamera,
    DirectionalLight,
    AmbientLight,
    Vector2,
    WebGLRenderTarget,
    Mesh,
    Box3,
    Vector3,
    BufferGeometry,
    BufferAttribute,
    MeshBasicMaterial,
    GridHelper
} from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore --types missing atm
import { MathUtils } from "three";
import { OrbitControls } from "./orbitControls";
import { MeshExtended } from "./MeshExtended";
import { propertyMap, propertyMapType } from "./propertyMap";
import { readAndParseIFC } from "./readAndParseIFC";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore --types missing atm
import Stats from "stats.js/src/Stats.js";
import { SpaceNavigator } from "./spaceNavigator";
import { resetColorId } from "./colorId";
import { material } from "./material";
import { PlaneHelperX, planes } from "./planeHelperX";
import { planeState, planeStateType } from "./planeState";
import { materialPicking } from "./materialPicking";
import { resetCollectionId } from "./collectionId";
import { resetMeshId } from "./getNewMeshId";
import { collectionMap } from "./collectionMap";

export type { planeStateType } from "./planeState";

type listener = { handleEvent: (e: any) => void };
type selectionMapType = { id: number; meshID: number; group: number; color: Color };
export class ViewController {
    private __renderer: WebGLRenderer;
    private __scene: Scene;
    private __camera: PerspectiveCamera;
    private __controls: OrbitControls;
    private __ambientLight: AmbientLight;
    private __directionalLight2: any;
    private __directionalLight1: any;
    private __monitors: Stats;
    private __threeCanvas: HTMLCanvasElement;

    private __selectionColor = new Color("red");
    private __listeners: Set<listener>;

    private __selectedElements = new Map<number, selectionMapType>();
    private __hiddenElements = new Map<number, selectionMapType>();

    private __spaceNavigatorEnabled: boolean;
    private __spaceNavigator: SpaceNavigator;
    private __lastSelectedCenter: Vector3;
    private __planeHelpers: PlaneHelperX[] = [];
    public __lastSelectedBoxSize: number;
    __gridHelper: GridHelper;
    __gr: any;

    constructor(canvas: string | HTMLCanvasElement) {
        this.__listeners = new Set<listener>();
        this.__addRender(canvas);
        this.__addScene();
        this.__addCamera();
        this.__addControls();
        this.__AddSpaceNavigator();
        this.__addLights();
        this.__addWindowResizer();
        this.__addStats();
        this.__addClickEvent();
        this.__addClipping();
        this.__addPlane();
        this.animationLoop();
    }

    private __addPlane(divisions = 50) {
        this.__gridHelper = new GridHelper(100, divisions);
        this.__scene.add(this.__gridHelper);
        this.__gridHelper.visible = false;
    }

    public enablePlane() {
        this.__gridHelper.visible = true;
    }

    public disablePlane() {
        this.__gridHelper.visible = false;
    }

    public togglePlane() {
        this.__gridHelper.visible = this.__gridHelper.visible ? false : true;
    }

    private __addClipping() {
        this.__renderer.localClippingEnabled = true;

        this.__planeHelpers.push(new PlaneHelperX(planes[0], 100, 0xff0000));
        this.__planeHelpers.push(new PlaneHelperX(planes[1], 100, 0x00ff00));
        this.__planeHelpers.push(new PlaneHelperX(planes[2], 100, 0x0000ff));
        this.__planeHelpers.forEach((x) => {
            x.visible = false;
            this.__scene.add(x);
        });

        function makeCopy<T>(x: T): T {
            return JSON.parse(JSON.stringify(x));
        }

        let planeStateOld: planeStateType = makeCopy(planeState.getValue());
        planeState.subscribe(this, () => {
            const currentState = planeState.getValue();

            if (currentState.x_plane_neg !== planeStateOld.x_plane_neg) {
                planeState.setValue({ x_plane_neg: !currentState.x_plane_neg });
                planes[0].negate();
            }

            if (currentState.y_plane_neg !== planeStateOld.y_plane_neg) {
                planeState.setValue({ y_plane_neg: !currentState.y_plane_neg });
                planes[1].negate();
            }

            if (currentState.z_plane_neg !== planeStateOld.z_plane_neg) {
                planeState.setValue({ z_plane_neg: !currentState.z_plane_neg });
                planes[2].negate();
            }

            if (currentState.x_plane_visible !== planeStateOld.x_plane_visible) {
                this.__planeHelpers[0].visible = currentState.x_plane_visible;
            }

            if (currentState.y_plane_visible !== planeStateOld.y_plane_visible) {
                this.__planeHelpers[1].visible = currentState.y_plane_visible;
            }

            if (currentState.z_plane_visible !== planeStateOld.z_plane_visible) {
                this.__planeHelpers[2].visible = currentState.z_plane_visible;
            }

            if (currentState.x_plane_offset !== planeStateOld.x_plane_offset) {
                planes[0].constant = currentState.x_plane_offset;
            }

            if (currentState.y_plane_offset !== planeStateOld.y_plane_offset) {
                planes[1].constant = currentState.y_plane_offset;
            }

            if (currentState.z_plane_offset !== planeStateOld.z_plane_offset) {
                planes[2].constant = currentState.z_plane_offset;
            }

            if (
                currentState.x_plane_enable !== planeStateOld.x_plane_enable ||
                currentState.y_plane_enable !== planeStateOld.y_plane_enable ||
                currentState.z_plane_enable !== planeStateOld.z_plane_enable
            ) {
                const p = [];

                if (currentState.x_plane_enable) {
                    p.push(planes[0]);
                }

                if (currentState.y_plane_enable) {
                    p.push(planes[1]);
                }

                if (currentState.z_plane_enable) {
                    p.push(planes[2]);
                }
                material.clippingPlanes = p;
                materialPicking.clippingPlanes = p;
            }

            planeStateOld = makeCopy(planeState.getValue());
        });
    }

    public getClippingState() {
        return planeState;
    }

    private animationLoop() {
        if (this.__monitors) {
            this.__monitors.begin();
        }
        if (this.__spaceNavigatorEnabled) {
            this.__spaceNavigator.update();
            this.__camera.position.copy(this.__spaceNavigator.position);
            this.__camera.rotation.copy(this.__spaceNavigator.rotation);
            this.__camera.updateProjectionMatrix();
        }

        this.__renderer.render(this.__scene, this.__camera);

        if (this.__monitors) {
            this.__monitors.end();
        }

        requestAnimationFrame(() => this.animationLoop());
    }

    public enableSpaceNavigator() {
        // TODO: I should move postition from orbit controls over to this
        this.__spaceNavigatorEnabled = true;
    }

    public disableSpaceNavigator() {
        this.__spaceNavigatorEnabled = false;
    }

    private __AddSpaceNavigator() {
        this.__spaceNavigator = new SpaceNavigator({
            rollEnabled: false,
            movementEnabled: true,
            lookEnabled: true,
            invertPitch: false,
            fovEnabled: false,
            fovMin: 2,
            fovMax: 115,
            rotationSensitivity: 0.05,
            movementEasing: 3,
            movementAcceleration: 700,
            fovSensitivity: 0.01,
            fovEasing: 3,
            fovAcceleration: 5,
            invertScroll: false
        });
    }

    private __addRender(canvas: string | HTMLCanvasElement) {
        if (typeof canvas === "string") {
            this.__threeCanvas = document.getElementById("3dview") as HTMLCanvasElement;
            this.__renderer = new WebGLRenderer({
                antialias: true,
                canvas: this.__threeCanvas
            });
        } else {
            this.__threeCanvas = canvas;
            this.__renderer = new WebGLRenderer({
                antialias: true,
                canvas: canvas
            });
        }

        this.__renderer.setSize(window.innerWidth, window.innerHeight);
        this.__renderer.setPixelRatio(window.devicePixelRatio);
    }

    private __addScene() {
        this.__scene = new Scene();
        this.__scene.background = new Color("black");
    }

    private __addCamera() {
        this.__camera = new PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        //  this.camera.position.z = 5;
    }

    private __addControls() {
        this.__controls = new OrbitControls(this.__camera, this.__renderer.domElement);
    }

    private __addLights() {
        this.__directionalLight1 = new DirectionalLight(0xffeeff, 0.8);
        this.__directionalLight1.position.set(1, 1, 1);
        this.__scene.add(this.__directionalLight1);

        this.__directionalLight2 = new DirectionalLight(0xffffff, 0.8);
        this.__directionalLight2.position.set(-1, 0.5, -1);
        this.__scene.add(this.__directionalLight2);

        this.__ambientLight = new AmbientLight(0xffffee, 0.25);
        this.__scene.add(this.__ambientLight);
    }

    private __addWindowResizer() {
        window.addEventListener("resize", () => {
            this.__camera.aspect = window.innerWidth / window.innerHeight;
            this.__camera.updateProjectionMatrix();
            this.__renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    private __addStats() {
        this.__monitors = new Stats();
        this.__monitors.showPanel(0);
        this.__monitors.dom.style.left = null;
        this.__monitors.dom.style.right = "0px";
        if (this.__monitors.dom.children[1]) {
            (this.__monitors.dom.children[1] as HTMLElement).style.display = "block";
        }
        if (this.__monitors.dom.children[2] as HTMLElement) {
            (this.__monitors.dom.children[2] as HTMLElement).style.display = "block";
        }

        document.body.appendChild(this.__monitors.dom);
    }

    public async readFile(file: File[], loadPropertySets: boolean) {
        for (let i = 0; i < file.length; i++) {
            try {
                const { meshWithAlpha, meshWithoutAlpha } = await readAndParseIFC(
                    file[i],
                    loadPropertySets
                );

                if (meshWithAlpha) this.__scene.add(meshWithAlpha);
                if (meshWithoutAlpha) this.__scene.add(meshWithoutAlpha);
                if (meshWithAlpha || meshWithoutAlpha) {
                    this.fitModelToFrame(meshWithoutAlpha || meshWithAlpha);
                }
            } catch (err) {
                console.log(err);
                console.log("file:", file[i]);
            }
        }
    }

    public fitModelToFrame(object: Mesh) {
        const box = new Box3().setFromObject(object);
        const boxSize = box.getSize(new Vector3()).length();
        const boxCenter = box.getCenter(new Vector3());

        const halfSizeToFitOnScreen = boxSize * 0.5;
        const halfFovY = MathUtils.degToRad(this.__camera.fov * 0.5);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

        const direction = new Vector3()
            .subVectors(this.__camera.position, boxCenter)
            .multiply(new Vector3(1, 0, 1))
            .normalize();

        this.__camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
        this.__camera.updateProjectionMatrix();
        this.__camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
        this.__camera.near = 1;
        this.__camera.far = boxSize * 100;
        // set target to newest loaded model

        this.__controls.target.copy(boxCenter);
        this.__controls.update();
    }

    private __getClickId(mouse: Vector2) {
        // activate our picking material
        this.__scene.children.forEach((e: MeshExtended) => {
            if (e.pickable) {
                e.pickable();
            }
        });

        this.__camera.setViewOffset(
            this.__renderer.domElement.width,
            this.__renderer.domElement.height,
            (mouse.x * window.devicePixelRatio) | 0,
            (mouse.y * window.devicePixelRatio) | 0,
            1,
            1
        );

        // render the scene
        const pickingTexture = new WebGLRenderTarget(1, 1);
        const pixelBuffer = new Uint8Array(4);
        this.__renderer.setRenderTarget(pickingTexture);
        this.__renderer.render(this.__scene, this.__camera);

        this.__renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);

        //interpret the pixel as an ID
        const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];

        this.__camera.clearViewOffset();

        // deactivate picking material
        this.__scene.children.forEach((e: MeshExtended) => {
            // just reset
            if (e.unpickable) {
                e.unpickable();
            }
        });

        this.__renderer.setRenderTarget(null);
        return id;
    }

    public addEventListener(context: listener) {
        this.__listeners.add(context);
    }

    public removeEventListener(context: listener) {
        this.__listeners.delete(context);
    }

    public clearScene() {
        propertyMap.clear();
        resetColorId();
        resetCollectionId();
        resetMeshId();
        const toRemove: MeshExtended[] = [];
        this.__scene.children.forEach((mesh: MeshExtended) => {
            if (mesh.meshID) {
                mesh.geometry.dispose();
                mesh.remove();
                toRemove.push(mesh);
            }
        });
        toRemove.map((m) => this.__scene.remove(m));
    }

    private __triggerSelectEvent(id: number) {
        if (id) {
            const data = propertyMap.get(id);
            const listeners = Array.from(this.__listeners);
            listeners.forEach((l) => {
                l.handleEvent({ type: "modelClick", data });
            });
        }
    }

    private __deselectElement(elementRef: selectionMapType) {
        this.__scene.children.forEach((e: MeshExtended) => {
            if (e.meshID === elementRef.meshID) {
                const group = e.geometry.groups[elementRef.group];
                const colorAtt = e.geometry.attributes.color;
                const index = e.geometry.index.array;

                for (let i = group.start; i < group.start + group.count; i++) {
                    const p = index[i] * 4;
                    (colorAtt as any).array[p] = elementRef.color.r;
                    (colorAtt as any).array[p + 1] = elementRef.color.g;
                    (colorAtt as any).array[p + 2] = elementRef.color.b;
                }
                colorAtt.needsUpdate = true;
            }
        });
    }

    private __hideElement(elementRef: selectionMapType) {
        this.__scene.children.forEach((e: MeshExtended) => {
            if (e.meshID === elementRef.meshID) {
                const group = e.geometry.groups[elementRef.group];
                const attribute = e.geometry.attributes.hidden;
                const index = e.geometry.index.array;

                for (let i = group.start; i < group.start + group.count; i++) {
                    const p = index[i];
                    (attribute as any).array[p] = 1;
                }
                attribute.needsUpdate = true;
            }
        });
    }

    private __showElement(elementRef: selectionMapType) {
        this.__scene.children.forEach((e: MeshExtended) => {
            if (e.meshID === elementRef.meshID) {
                const group = e.geometry.groups[elementRef.group];
                const attribute = e.geometry.attributes.hidden;
                const index = e.geometry.index.array;

                for (let i = group.start; i < group.start + group.count; i++) {
                    const p = index[i];
                    (attribute as any).array[p] = 0;
                }
                attribute.needsUpdate = true;
            }
        });
    }

    public debugShowPickingColors() {
        this.__scene.children.forEach((e: MeshExtended) => {
            if (e.pickable) {
                e.pickable();
            }
        });
    }

    public debugHidePickingColors() {
        this.__scene.children.forEach((e: MeshExtended) => {
            if (e.unpickable) {
                e.unpickable();
            }
        });
    }

    public hideSelected() {
        const selectedElements = Array.from(this.__selectedElements);
        this.__selectedElements.clear();
        selectedElements.forEach(([, elementRef]) => {
            // we do this to reset colors..
            this.__deselectElement(elementRef);
        });
        selectedElements.forEach(([id, elementRef]) => {
            this.__hiddenElements.set(id, elementRef);
            this.__hideElement(elementRef);
        });
    }

    public toggleWireframe(force: boolean = null) {
        if (force !== null) {
            material.wireframe = force;
        } else {
            material.wireframe = material.wireframe ? false : true;
        }
    }

    public invertSelection() {
        // first part will be to remove current selection
        const selectedElements = Array.from(this.__selectedElements);
        this.__selectedElements.clear();
        selectedElements.forEach(([, elementRef]) => {
            // we do this to reset colors..
            this.__deselectElement(elementRef);
        });

        const selected = selectedElements.map(([, elementRef]) => elementRef.id);

        this.__scene.children.forEach((e: MeshExtended) => {
            if (e.meshID) {
                e.geometry.groups.forEach((group, i) => {
                    const colorAtt = e.geometry.attributes.color;
                    const index = e.geometry.index.array;

                    let id;
                    {
                        // get the picking ID
                        const i = group.start;
                        const x = index[i] * 3;
                        const arr = e.geometry.attributes.colorpicking.array;

                        id = new Color(arr[x], arr[x + 1], arr[x + 2]).getHex();
                    }

                    if (selected.indexOf(id) !== -1) {
                        return;
                    }

                    // get existing colors, so we can set it back later
                    const currentColor = new Color();
                    {
                        const i = group.start;
                        const x = index[i] * 4;
                        currentColor.r = colorAtt.array[x];
                    }

                    {
                        const i = group.start;
                        const x = index[i] * 4;
                        currentColor.g = colorAtt.array[x + 1];
                    }

                    {
                        const i = group.start;
                        const x = index[i] * 4;
                        currentColor.b = colorAtt.array[x + 2];
                    }

                    // store state

                    this.__selectedElements.set(id, {
                        id: id,
                        color: currentColor,
                        meshID: e.meshID,
                        group: i
                    });

                    for (let i = group.start; i < group.start + group.count; i++) {
                        const p = index[i] * 4;
                        (colorAtt as any).array[p] = this.__selectionColor.r;
                        (colorAtt as any).array[p + 1] = this.__selectionColor.g;
                        (colorAtt as any).array[p + 2] = this.__selectionColor.b;
                    }
                });

                e.geometry.attributes.color.needsUpdate = true;
            }
        });
    }

    public showAll() {
        const hiddenElements = Array.from(this.__hiddenElements);
        this.__hiddenElements.clear();
        hiddenElements.forEach(([id, elementRef]) => {
            this.__hiddenElements.set(id, elementRef);
            this.__showElement(elementRef);
        });
    }

    private __getCenterAndSize(clickedMesh: MeshExtended, prop: propertyMapType) {
        const group = clickedMesh.geometry.groups[prop.group];
        const positionAtt = clickedMesh.geometry.attributes.position;
        const index = clickedMesh.geometry.index.array;
        const bg = new BufferGeometry();
        const newIndex = (index as any).slice(group.start, group.start + group.count);
        const positions: number[] = [];
        for (let i = group.start; i < group.start + group.count; i++) {
            const p = index[i] * 3;
            positions.push(positionAtt.array[p]);
            positions.push(positionAtt.array[p + 1]);
            positions.push(positionAtt.array[p + 2]);
        }
        const x: any = newIndex;
        const min = Math.min(...x);

        for (let i = 0; i < newIndex.length; i++) {
            newIndex[i] = newIndex[i] - min;
        }

        bg.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3, true));
        bg.setIndex(new BufferAttribute(newIndex, 1));
        const mesh = new Mesh(bg, new MeshBasicMaterial({ color: 0x00ff00 }));
        mesh.applyMatrix4(clickedMesh.matrixWorld);
        mesh.updateWorldMatrix(true, true);
        const box = new Box3().setFromObject(mesh);
        const boxSize = box.getSize(new Vector3()).length();
        const boxCenter = box.getCenter(new Vector3());
        this.__lastSelectedCenter = boxCenter;
        this.__lastSelectedBoxSize = boxSize;
    }

    public focusOnLastSelected() {
        if (this.__lastSelectedCenter) {
            this.__controls.target.copy(this.__lastSelectedCenter);
            this.__controls.update();
        }
    }

    private __addClickEvent() {
        this.__threeCanvas.onpointerdown = (event: MouseEvent) => {
            if (event.button != 0) return;

            setTimeout(() => {
                this.__threeCanvas.onpointerup = null;
            }, 300);

            this.__threeCanvas.onpointerup = () => {
                const mouse = new Vector2();
                mouse.x = event.clientX;
                mouse.y = event.clientY;

                const id = this.__getClickId(mouse);
                if (id) {
                    this.__triggerSelectEvent(id);
                    const clickedPropertyMesh = propertyMap.get(id);
                    const collection = collectionMap.get(clickedPropertyMesh.collectionID);

                    // next part is just spagetti still and not very dynamic, on my todo..
                    let addToSelection = false;
                    if (event.ctrlKey) {
                        addToSelection = true;
                    }

                    if (!addToSelection) {
                        const selectedElements = Array.from(this.__selectedElements);
                        this.__selectedElements.clear();
                        selectedElements.forEach(([, elementRef]) => {
                            this.__deselectElement(elementRef);
                        });
                    } else {
                        collection.forEach((partId) => {
                            if (this.__selectedElements.has(partId)) {
                                const elementRef = this.__selectedElements.get(partId);
                                this.__selectedElements.delete(partId);
                                this.__deselectElement(elementRef);
                                return;
                            }
                        });
                    }

                    // new color
                    const meshIds = collection.map((x) => propertyMap.get(x).meshID);

                    this.__scene.children.forEach((e: MeshExtended) => {
                        if (meshIds.indexOf(e.meshID) !== -1) {
                            collection.forEach((partId) => {
                                const propertyMesh = propertyMap.get(partId);

                                if (propertyMesh.meshID === e.meshID) {
                                    const group = e.geometry.groups[propertyMesh.group];
                                    const colorAtt = e.geometry.attributes.color;
                                    const index = e.geometry.index.array;

                                    if (id === partId) {
                                        //not really optimal..
                                        this.__getCenterAndSize(e, clickedPropertyMesh);
                                    }

                                    // get existing colors, so we can set it back later
                                    const currentColor = new Color();
                                    {
                                        const i = group.start;
                                        const x = index[i] * 4;
                                        currentColor.r = colorAtt.array[x];
                                    }

                                    {
                                        const i = group.start;
                                        const x = index[i] * 4;
                                        currentColor.g = colorAtt.array[x + 1];
                                    }

                                    {
                                        const i = group.start;
                                        const x = index[i] * 4;
                                        currentColor.b = colorAtt.array[x + 2];
                                    }

                                    // store state
                                    this.__selectedElements.set(partId, {
                                        id: partId,
                                        color: currentColor,
                                        meshID: propertyMesh.meshID,
                                        group: propertyMesh.group
                                    });

                                    for (let i = group.start; i < group.start + group.count; i++) {
                                        const p = index[i] * 4;
                                        (colorAtt as any).array[p] = this.__selectionColor.r;
                                        (colorAtt as any).array[p + 1] = this.__selectionColor.g;
                                        (colorAtt as any).array[p + 2] = this.__selectionColor.b;
                                    }

                                    // TODO: look at update range
                                    colorAtt.needsUpdate = true;
                                }
                            });
                        }
                    });
                }
            };
        };
    }
}
