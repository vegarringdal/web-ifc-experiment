import { WebGLRenderer } from "three";
import * as WebIFC from "web-ifc/web-ifc-api";
import { loadAllGeometry } from "./loadAllGeometry";
import { MeshExtended } from "./MeshExtended";

export function readAndParseIFC(
    render: WebGLRenderer,
    file: File,
    loadPropertySets: boolean
): Promise<{ meshWithAlpha: MeshExtended; meshWithoutAlpha: MeshExtended }> {
    return new Promise(async (resolve, reject) => {
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileRef = reader.result as ArrayBuffer;
                const uIntArrayBuffer = new Uint8Array(fileRef);

                const data = new Uint8Array(uIntArrayBuffer);
                const modelID = ifcAPI.OpenModel(data);
                try {
                    const c = loadAllGeometry(render, modelID, ifcAPI, loadPropertySets);

                    resolve(c);
                } catch (err) {
                    reject(err);
                }

                // return all geometry
            };

            reader.onerror = (err) => {
                reject(err);
            };
            reader.readAsArrayBuffer(file);
        }
    });
}
