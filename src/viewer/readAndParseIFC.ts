import { Mesh } from "three";
import * as WebIFC from "web-ifc/web-ifc-api";
import { loadAndMergeGeometry } from "./loadAndMergeGeometry";

export function readAndParseIFC(file: File): Promise<Mesh[]> {
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
                try {
                    const c = loadAndMergeGeometry(modelID, ifcAPI);
                    ifcAPI.CloseModel(modelID); // dont know if this really do much,..
                    ifcAPI = null;
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
