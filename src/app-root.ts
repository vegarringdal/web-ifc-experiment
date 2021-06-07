import { html, render } from "lit-html";
import { ViewController } from "viewer/controller";

export class AppRoot extends HTMLElement {
    viewController: ViewController;
    data: { keys: any[]; values: any[] } = null;

    public connectedCallback() {
        this.render();
        this.viewController = new ViewController("3dview");
        this.viewController.addEventListener(this);
    }

    handleEvent(e: any) {
        // only event I have atm is from grip click event...
        if (e?.data) {
            // just store them as key/values for now

            e.data.properties["element type"] = e.data?.properties?.constructor?.name;

            this.data = e.data.properties;
            this.render();
        }
    }

    // helper to trigger html update
    public render() {
        render(this.template(), this);
    }

    private getIFCDataAsHtml(data: Record<string, any>) {
        if (!data) {
            return "";
        }

        function getKeyValue(data: Record<string, any>) {
            const keys = Object.keys(data);
            const values = keys.map((x) => {
                if (data[x]?.value) {
                    return data[x]?.value;
                } else {
                    return data[x];
                }
            });
            return { values, keys };
        }

        const { values, keys } = getKeyValue(data);

        if (keys.length) {
            return html`
                <div class="text-center bg-indigo-500">Data:</div>
                ${keys.map((key: string, i: number) => {
                    if (key === "PropertySet") {
                        return html`<div>
                            <span class="font-semibold">IfcPropertySets:</span
                            ><span>${values[i].length}</span>
                        </div>`;
                    } else {
                        return html`<div>
                            <span class="font-semibold">${key}:</span><span>${values[i]}</span>
                        </div>`;
                    }
                })}
            `;
        } else {
            return "no data";
        }
    }

    // this is helper for app-root innerHtml
    public template() {
        return html`
            <!--   template -->
            <canvas class="top-0 absolute w-full h-full" id="3dview"> </canvas>
            <label class="inline-block p-2 m-2 bg-indigo-300 z-10 relative">
                <input
                    type="file"
                    class="hidden"
                    @change=${async (e: any) => {
                        await this.viewController.readFile(e.target.files[0], false);
                        e.target.value = ""; // reset so we can load same file name again..
                    }}
                />
                open file
            </label>

            <label class="inline-block p-2 m-2 bg-indigo-300 z-10 relative">
                <input
                    type="file"
                    class="hidden"
                    @change=${async (e: any) => {
                        await this.viewController.readFile(e.target.files[0], true);
                        e.target.value = ""; // reset so we can load same file name again..
                    }}
                />
                open file with propertySet
            </label>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.hideSelected();
                }}
            >
                Hide Selected
            </button>
            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.showAll();
                }}
            >
                Show all
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.debugShowPickingColors();
                }}
            >
                showGPU color
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.debugHidePickingColors();
                }}
            >
                hideGPU color
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.enableSpaceNavigator();
                }}
            >
                enable SpaceNavigator
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.disableSpaceNavigator();
                }}
            >
                disable SpaceNavigator
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.invertSelection();
                }}
            >
                invert selection
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.focusOnLastSelected();
                }}
            >
                focus on last selected
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.clearScene();
                }}
            >
                clearScene
            </button>

            <button
                class="inline-block p-2 m-2 bg-indigo-300 z-10 relative"
                @click=${() => {
                    this.viewController.toggleWireframe();
                }}
            >
                toggleWireframe
            </button>

            <div class="bottom-0 right-0 absolute bg-indigo-300 m-2 p-2 flex flex-col">
                ${this.getIFCDataAsHtml(this.data)}
            </div>
        `;
    }
}
