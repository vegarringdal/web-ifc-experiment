import { Vector4 } from "three";

export type propertyMapType = {
    properties: any;
    color: Vector4;
    collectionID: number;
};
export const propertyMap = new Map<number, propertyMapType>();
