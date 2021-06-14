import { ObjectState } from "./state/state";

export type planeStateType = {
    z_plane_visible: boolean;
    y_plane_visible: boolean;
    x_plane_visible: boolean;
    z_plane_enable: boolean;
    y_plane_enable: boolean;
    x_plane_enable: boolean;
    z_plane_neg: boolean;
    y_plane_neg: boolean;
    x_plane_neg: boolean;
    z_plane_offset: number;
    y_plane_offset: number;
    x_plane_offset: number;
};

export const planeState = new ObjectState<planeStateType>("PLANE_STATE", {
    z_plane_visible: false,
    y_plane_visible: false,
    x_plane_visible: false,
    z_plane_enable: false,
    y_plane_enable: false,
    x_plane_enable: false,
    z_plane_neg: true,
    y_plane_neg: true,
    x_plane_neg: true,
    z_plane_offset: 0,
    y_plane_offset: 0,
    x_plane_offset: 0
});
