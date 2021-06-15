let meshID = 0;

export function getNewMeshId() {
    meshID++;
    return meshID;
}

export function resetMeshId() {
    meshID = 0;
}
