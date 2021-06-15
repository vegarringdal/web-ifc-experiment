let collectionI = 0;

export function getNewCollectionId() {
    collectionI++;
    return collectionI;
}

export function getCurrentCollectionId() {
    return collectionI;
}

export function resetCollectionId() {
    collectionI = 0;
}
