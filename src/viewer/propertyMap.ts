export type propertyMapType = {
    color: { x: number; y: number; z: number; w: number };
    properties: any;
};
export const propertyMap = new Map<number, propertyMapType>();
