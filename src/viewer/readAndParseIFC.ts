import * as WebIFC from "web-ifc/web-ifc-api";
import { loadAllGeometry } from "./loadAllGeometry";
import { MeshExtended } from "./MeshExtended";

export function readAndParseIFC(
    file: File
): Promise<{ meshWithAlpha: MeshExtended; meshWithoutAlpha: MeshExtended }> {
    return new Promise(async (resolve, reject) => {
        let ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileRef = reader.result as ArrayBuffer;
                const uIntArrayBuffer = new Uint8Array(fileRef);

                const data = new Uint8Array(uIntArrayBuffer);
                const modelID = ifcAPI.OpenModel(data);

                const c = loadAllGeometry(modelID, ifcAPI);
                ifcAPI.CloseModel(modelID); // dont know if this really do much,..
                ifcAPI = null;
                // return all geometry
                resolve(c);
            };

            reader.onerror = (err) => {
                reject(err);
            };
            reader.readAsArrayBuffer(file);
        }
    });
}
