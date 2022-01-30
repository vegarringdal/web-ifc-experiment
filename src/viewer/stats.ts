import { ObjectState } from "./state/state";

type STATS = {
    calls: number;
    lines: number;
    points: number;
    triangles: number;
};

export const statsState = new ObjectState<STATS>("STATS_STATE", {
    calls: 0,
    lines: 0,
    points: 0,
    triangles: 0
});
