import { html } from "lit-html";
import { planeState } from "viewer/planeState";

// some code duplication, but easier experiment this way and make modifiction

export function clippingControlY(rerender: () => void) {
    const pState = planeState.getValue();

    return html`<div class="flex flex-col flex-1 bg-gray-800 m-1">
        <span class="text-green-500 font-bold text-2xl text-center mb-3">Y</span>
        <div class="flex">
            <div class="flex-1 text-center text-white">Show Helper</div>
            <div class="flex-1 text-center text-white">Inverted</div>
            <div class="flex-1 text-center text-white">Enabled</div>
        </div>
        <div class="flex">
            <input
                .checked=${pState.y_plane_visible}
                @click=${() => {
                    planeState.setValue({
                        y_plane_visible: !pState.y_plane_visible
                    });
                    rerender();
                }}
                class="flex-1"
                type="checkbox"
            />
            <input
                @click=${() => {
                    planeState.setValue({ y_plane_neg: !pState.y_plane_neg });
                }}
                class="flex-1"
                type="checkbox"
            />
            <input
                .checked=${pState.y_plane_enable}
                @click=${() => {
                    planeState.setValue({
                        y_plane_enable: !pState.y_plane_enable
                    });
                    rerender();
                }}
                class="flex-1"
                type="checkbox"
            />
        </div>
        <div class="range-green flex flex-col p-1 m-1 mt-5">
            <input
                .value=${pState.y_plane_offset}
                @input=${(e: any) => {
                    planeState.setValue({ y_plane_offset: e.target.value });
                    rerender();
                }}
                type="range"
                min="-100"
                max="100"
                value="0"
            />
        </div>
    </div>`;
}

export function clippingControlZ(rerender: () => void) {
    const pState = planeState.getValue();

    return html`<div class="flex flex-col flex-1 bg-gray-800 m-1">
        <span class="text-yellow-500 font-bold text-2xl text-center mb-3">Z</span>
        <div class="flex">
            <div class="flex-1 text-center text-white">Show Helper</div>
            <div class="flex-1 text-center text-white">Invert</div>
            <div class="flex-1 text-center text-white">Enable</div>
        </div>
        <div class="flex">
            <input
                .checked=${pState.z_plane_visible}
                @click=${() => {
                    planeState.setValue({
                        z_plane_visible: !pState.z_plane_visible
                    });
                    rerender();
                }}
                class="flex-1"
                type="checkbox"
            />
            <input
                @click=${() => {
                    planeState.setValue({ z_plane_neg: !pState.z_plane_neg });
                }}
                class="flex-1"
                type="checkbox"
            />
            <input
                .checked=${pState.z_plane_enable}
                @click=${() => {
                    planeState.setValue({
                        z_plane_enable: !pState.z_plane_enable
                    });
                    rerender();
                }}
                class="flex-1"
                type="checkbox"
            />
        </div>
        <div class="range-yellow flex flex-col p-1 m-1 mt-5">
            <input
                .value=${pState.z_plane_offset}
                @input=${(e: any) => {
                    planeState.setValue({ z_plane_offset: e.target.value });
                    rerender();
                }}
                type="range"
                min="-100"
                max="100"
                value="0"
            />
        </div>
    </div>`;
}

export function clippingControlX(rerender: () => void) {
    const pState = planeState.getValue();

    return html`<div class="flex flex-col flex-1 bg-gray-800 m-1">
        <span class="text-red-500 font-bold text-2xl text-center mb-3">X</span>
        <div class="flex">
            <div class="flex-1 text-center text-white">Show helper</div>
            <div class="flex-1 text-center text-white">Inverted</div>
            <div class="flex-1 text-center text-white">Enabled</div>
        </div>
        <div class="flex">
            <input
                .checked=${pState.x_plane_visible}
                @click=${() => {
                    planeState.setValue({
                        x_plane_visible: !pState.x_plane_visible
                    });
                    rerender();
                }}
                class="flex-1"
                type="checkbox"
            />
            <input
                @click=${() => {
                    planeState.setValue({ x_plane_neg: !pState.x_plane_neg });
                }}
                class="flex-1"
                type="checkbox"
            />
            <input
                .checked=${pState.x_plane_enable}
                @click=${() => {
                    planeState.setValue({
                        x_plane_enable: !pState.x_plane_enable
                    });
                    rerender();
                }}
                class="flex-1"
                type="checkbox"
            />
        </div>
        <div class="range-red flex flex-col p-1 m-1 mt-5">
            <input
                .value=${pState.x_plane_offset}
                @input=${(e: any) => {
                    planeState.setValue({ x_plane_offset: e.target.value });
                    rerender();
                }}
                type="range"
                min="-100"
                max="100"
                value="0"
            />
        </div>
    </div>`;
}
