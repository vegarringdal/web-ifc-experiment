export type propertyMapType = {
    meshID: number;
    group: number;
    expressID: number;
    properties: any;
    collectionID: number;
};
export const propertyMap = new Map<number, propertyMapType>();
