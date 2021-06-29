/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    WebGLRenderer,
    Scene,
    Color,
    PerspectiveCamera,
    DirectionalLight,
    AmbientLight,
    Vector2,
    Box3,
    Vector3,
    Mesh,
    GridHelper,
    Raycaster,
    BufferGeometry,
    Intersection,
    BufferAttribute
} from "three";

//@ts-ignore
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";
//@ts-ignore
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
//@ts-ignore
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore --types missing atm
import { MathUtils } from "three";
import { OrbitControls } from "./orbitControls";
import { MeshExtended } from "./MeshExtended";
import { propertyMap } from "./propertyMap";
import { readAndParseIFC } from "./readAndParseIFC";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore --types missing atm
import Stats from "stats.js/src/Stats.js";
import { SpaceNavigator } from "./spaceNavigator";
import { PlaneHelperX, planes } from "./planeHelperX";
import { planeState, planeStateType } from "./planeState";
import { resetMeshId } from "./getNewMeshId";
import { resetId } from "./colorId";
//@ts-ignore
import { acceleratedRaycast } from "three-mesh-bvh";
import { getMaterial } from "./material";

export type { planeStateType } from "./planeState";

type listener = { handleEvent: (e: any) => void };
type selectionMapType = { id: number; meshID: number; group: number; color: Color };

// create raycaster
const raycaster = new Raycaster();

// update prototype, so selected objects get accelerated raycast
Mesh.prototype.raycast = acceleratedRaycast;

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
    private __listeners: Set<listener>;

    private __spaceNavigatorEnabled: boolean;
    private __spaceNavigator: SpaceNavigator;
    private __planeHelpers: PlaneHelperX[] = [];
    private __gridHelper: GridHelper;

    // todo: make private
    public __lastSelectedBoxSize: number;
    public __selectionColor = new Color("red");
    public __selectedElements = new Map<number, selectionMapType>();
    public __hiddenElements = new Map<number, selectionMapType>();
    public __lastSelectedCenter: Vector3;
    private __meshes: Mesh[] = [];
    __selected: any;
    private __translateCenter: Vector3;

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
                const p: any[] = [];

                if (currentState.x_plane_enable) {
                    p.push(planes[0]);
                }

                if (currentState.y_plane_enable) {
                    p.push(planes[1]);
                }

                if (currentState.z_plane_enable) {
                    p.push(planes[2]);
                }
                this.__scene.children.forEach((mesh: MeshExtended) => {
                    if (mesh.meshType) {
                        (mesh.material as any).clippingPlanes = p;
                    }
                });
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

    private __getCenter(object: any) {
        if (!this.__translateCenter) {
            const box = new Box3().setFromObject(object);
            this.__translateCenter = box.getCenter(new Vector3());
        }
        return this.__translateCenter;
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

    public async readFile(
        file: File[],
        center = false,
        callback?: (atFileNo: number, noOfFIles: number) => void
    ) {
        for (let i = 0; i < file.length; i++) {
            try {
                const meshesPerColor = await readAndParseIFC(file[i]);

                meshesPerColor.forEach((geo) => {
                    if (center) {
                        geo.translateY(geo.position.y - this.__getCenter(geo).y);
                        geo.translateX(geo.position.x - this.__getCenter(geo).x);
                        geo.translateZ(geo.position.z - this.__getCenter(geo).z + 1); // need +1 to not break
                    }

                    this.__meshes.push(geo);
                    this.__scene.add(geo);
                    callback(i + 1, file.length);
                });
            } catch (err) {
                console.log(err);
                console.log("file:", file[i]);
            }
            if (this.__meshes[0]) {
                this.fitModelToFrame(this.__meshes[0]);
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

    public addEventListener(context: listener) {
        this.__listeners.add(context);
    }

    public removeEventListener(context: listener) {
        this.__listeners.delete(context);
    }

    public clearScene() {
        propertyMap.clear();
        resetId();
        resetMeshId();
        this.__translateCenter = null;
        const toRemove: MeshExtended[] = [];
        this.__scene.children.forEach((mesh: MeshExtended) => {
            if (mesh.meshType) {
                mesh.geometry.dispose();
                mesh.remove();
                toRemove.push(mesh);
            }
        });
        toRemove.map((m) => this.__scene.remove(m));
    }

    public clearSelection() {
        const toRemove: MeshExtended[] = [];
        this.__scene.children.forEach((mesh: MeshExtended) => {
            if (mesh.meshType === "selected") {
                mesh.geometry.dispose();
                mesh.remove();
                toRemove.push(mesh);
            }
        });
        toRemove.map((m) => this.__scene.remove(m));
    }

    private filterClippingPlanes(objs: Intersection[]) {
        function filter(elem: any) {
            const clippingPlanes = elem.object.material.clippingPlanes;
            // if no clippingplane, then its nothing to test
            if (!clippingPlanes) {
                return true;
            }

            // https://stackoverflow.com/questions/41002587/three-js-clipping-and-raycasting/41005143#41005143
            // todo, look more into, how will this work really
            // I need to enable coloring first on selected before working more on this
            let result = false;
            clippingPlanes.forEach((clippingPlane: any) => {
                const distance = parseFloat(clippingPlane.distanceToPoint(elem.point));
                result = distance > 0;
            });

            return result;
        }
        return objs.filter(filter);
    }

    private __addSelected(add: boolean) {
        if (!add) {
            this.clearSelection();
        }
        const group = this.__selected.group;
        const positionAtt = this.__selected.mesh.geometry.attributes.position;
        const index = this.__selected.mesh.geometry.index.array;
        const bg = new BufferGeometry();
        const newIndex = (index as any).slice(group.start, group.start + group.count);
        const positions: number[] = [];
        for (let i = group.start; i < group.start + group.count; i++) {
            const p = index[i] * 3;
            positions.push(positionAtt.array[p]);
            positions.push(positionAtt.array[p + 1]);
            positions.push(positionAtt.array[p + 2]);
        }

        for (let i = 0; i < newIndex.length; i++) {
            newIndex[i] = i;
        }

        bg.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3, true));
        bg.setIndex(new BufferAttribute(newIndex, 1));
        const mesh = new Mesh(bg, getMaterial(new Color("blue"), 1));
        mesh.material.clippingPlanes = this.__selected.mesh.material.clippingPlanes;
        (mesh as MeshExtended).meshType = "selected";
        const box = new Box3().setFromObject(mesh);
        const boxSize = box.getSize(new Vector3()).length();
        const boxCenter = box.getCenter(new Vector3());
        this.__lastSelectedCenter = boxCenter;
        this.__lastSelectedBoxSize = boxSize;
        mesh.geometry.computeVertexNormals();

        if (this.__translateCenter) {
            mesh.translateY(mesh.position.y - this.__getCenter(mesh).y);
            mesh.translateX(mesh.position.x - this.__getCenter(mesh).x);
            mesh.translateZ(mesh.position.z - this.__getCenter(mesh).z + 1);
        }

        this.__scene.add(mesh);
        this.__selected.added = mesh;
    }

    private __addClickEvent() {
        this.__threeCanvas.onpointerdown = (event: MouseEvent) => {
            if (event.button != 0) return;

            setTimeout(() => {
                this.__threeCanvas.onpointerup = null;
            }, 300);

            this.__threeCanvas.onpointerup = () => {
                const mouse = new Vector2();
                this.__selected = null;
                let data: any = {};
                mouse.x = (event.clientX / this.__renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = -(event.clientY / this.__renderer.domElement.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, this.__camera);
                const intersectObjects = raycaster.intersectObjects(this.__meshes);
                const result = this.filterClippingPlanes(intersectObjects);
                if (result.length) {
                    const geometry = (result[0].object as Mesh).geometry;
                    const groups = geometry.groups;
                    const userData = geometry.userData.mergedUserData;
                    const faceNo = result[0].faceIndex * 3;

                    if (geometry.index && result.length) {
                        for (let i = 0; i < groups.length; i++) {
                            const limit = groups[i].start + groups[i].count;
                            if (limit > faceNo) {
                                this.__selected = {
                                    mesh: result[0].object as Mesh,
                                    group: geometry.groups[i]
                                };
                                this.__addSelected(event.ctrlKey);

                                data = propertyMap.get(userData[i].id);
                                console.log(data);
                                break;
                            }
                        }
                    }
                }

                Array.from(this.__listeners).forEach((subscriber) => {
                    subscriber.handleEvent({ type: "modelClick", data: data });
                });
            };
        };
    }
}
