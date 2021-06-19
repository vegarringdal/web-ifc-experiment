import { Mesh } from "three";
import * as WebIFC from "web-ifc/web-ifc-api";
import { loadAllGeometry } from "./loadAllGeometry";

export function readAndParseIFC(
    file: File,
    loadPropertySets: boolean
): Promise<{ meshWithAlphaArray: Mesh[]; meshWithoutAlphaArray: Mesh[] }> {
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
                    const c = loadAllGeometry(modelID, ifcAPI, loadPropertySets);
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
