import * as WebIFC from "web-ifc/web-ifc-api";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { GLBufferAttribute, Mesh, WebGLRenderer } from "three";
import { materialPicking } from "./materialPicking";
import { material } from "./material";
import { MeshExtended } from "./MeshExtended";
import { getAllGeometry } from "./getAllGeometry";

export function loadAllGeometry(
    render: WebGLRenderer,
    modelID: number,
    ifcAPI: WebIFC.IfcAPI,
    loadPropertySets: boolean
) {
    const { geometries, geometriesWithAlpha, normalMeshId, alphaMeshId } = getAllGeometry(
        modelID,
        ifcAPI,
        loadPropertySets
    );

    let meshWithoutAlpha: MeshExtended;
    let meshWithAlpha: MeshExtended;

    if (geometries) {
        meshWithoutAlpha = new Mesh(
            BufferGeometryUtils.mergeBufferGeometries(geometries, true),
            material
        ) as MeshExtended;
        meshWithoutAlpha.name = "no alpha";
        meshWithoutAlpha.meshID = normalMeshId;
        meshWithoutAlpha.pickable = function () {
            this.material = materialPicking;
        };
        meshWithoutAlpha.unpickable = function () {
            this.material = material;
        };

        {
            const array: any = meshWithoutAlpha.geometry.attributes.color.array;
            const gl = render.getContext();
            const pos = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pos);
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

            const attr = new GLBufferAttribute(pos, gl.FLOAT, 4, 4, array.length / 4);
            meshWithoutAlpha.geometry.setAttribute("color", attr as any);
        }

        {
            const array: any = meshWithoutAlpha.geometry.attributes.normal.array;
            const gl = render.getContext();
            const pos = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pos);
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

            const attr = new GLBufferAttribute(pos, gl.FLOAT, 3, 4, array.length / 3);
            meshWithoutAlpha.geometry.setAttribute("normal", attr as any);
        }
    }

    if (geometriesWithAlpha.length) {
        meshWithAlpha = new Mesh(
            BufferGeometryUtils.mergeBufferGeometries(geometriesWithAlpha, true),
            material
        ) as MeshExtended;
        meshWithAlpha.name = "alpha";
        meshWithAlpha.meshID = alphaMeshId;
        meshWithAlpha.pickable = function () {
            this.material = materialPicking;
        };
        meshWithAlpha.unpickable = function () {
            this.material = material;
        };
        {
            const array: any = meshWithAlpha.geometry.attributes.color.array;
            const gl = render.getContext();
            const pos = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pos);
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

            const attr = new GLBufferAttribute(pos, gl.FLOAT, 4, 4, array.length / 4);
            meshWithAlpha.geometry.setAttribute("color", attr as any);
        }

        {
            const array: any = meshWithAlpha.geometry.attributes.normal.array;
            const gl = render.getContext();
            const pos = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pos);
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

            const attr = new GLBufferAttribute(pos, gl.FLOAT, 3, 4, array.length / 3);
            meshWithAlpha.geometry.setAttribute("normal", attr as any);
        }
    }

    return { meshWithAlpha, meshWithoutAlpha };
}
