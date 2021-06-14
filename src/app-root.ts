import { clippingControlX, clippingControlY, clippingControlZ } from "clippingControl";
import { html, render } from "lit-html";
import { ViewController } from "viewer/controller";

export class AppRoot extends HTMLElement {
    viewController: ViewController;
    data: { keys: any[]; values: any[] } = null;
    buttonsHidden = true;
    showClipping: boolean;

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

    public showButtonsTemplate() {
        if (this.buttonsHidden) {
            return html`
                <div class="flex flex-col" style="max-width:150px">
                    <button
                        class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                        @click=${() => {
                            this.buttonsHidden = false;
                            this.render();
                        }}
                    >
                        Show Options
                    </button>
                </div>
            `;
        }

        // if not, we show all..

        return html`
            <!--   template -->
            <div class="flex flex-col" style="max-width:200px">
                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.buttonsHidden = true;
                        this.render();
                    }}
                >
                    Hide Options
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.clearScene();
                    }}
                >
                    Clear Scene
                </button>

                <label
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative text-center"
                >
                    <input
                        type="file"
                        class="hidden"
                        @change=${async (e: any) => {
                            await this.viewController.readFile(e.target.files[0], false);
                            e.target.value = ""; // reset so we can load same file name again..
                        }}
                    />
                    Open File
                </label>

                <label
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative text-center"
                >
                    <input
                        type="file"
                        class="hidden"
                        @change=${async (e: any) => {
                            await this.viewController.readFile(e.target.files[0], true);
                            e.target.value = ""; // reset so we can load same file name again..
                        }}
                    />
                    Open File (prop)
                </label>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.debugShowPickingColors();
                    }}
                >
                    Show GPU Color
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.debugHidePickingColors();
                    }}
                >
                    Hide GPU Color
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.enableSpaceNavigator();
                    }}
                >
                    Enable SpaceNavigator
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.disableSpaceNavigator();
                    }}
                >
                    Disable SpaceNavigator
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.toggleWireframe();
                    }}
                >
                    Toggle Wireframe
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.hideSelected();
                    }}
                >
                    Hide Selected
                </button>
                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.showAll();
                    }}
                >
                    Show All
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.invertSelection();
                    }}
                >
                    Invert Selection
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        // just for fun combine calls
                        this.viewController.invertSelection();
                        this.viewController.hideSelected();
                        this.viewController.focusOnLastSelected();
                    }}
                >
                    Hide not selected
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.focusOnLastSelected();
                    }}
                >
                    Focus on last selected
                </button>

                <button
                    class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                    @click=${() => {
                        this.viewController.togglePlane();
                    }}
                >
                    Toggle plane</button
                ><!--  -->
            </div>
        `;
    }

    public showClippingTools() {
        if (this.buttonsHidden && this.showClipping) {
            return html` <div class="bottom-0 absolute" style="width:350px">
                <div class="flex flex-col" style="max-width:150px">
                    <button
                        class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                        @click=${() => {
                            this.showClipping = false;
                            this.render();
                        }}
                    >
                        Hide
                    </button>
                </div>
                ${clippingControlX(() => this.render)} ${clippingControlY(() => this.render)}
                ${clippingControlZ(() => this.render)}
            </div>`;
        } else {
            if (this.buttonsHidden && !this.showClipping) {
                return html`
                    <div class="flex flex-col" style="max-width:150px">
                        <button
                            class="inline-block p-2 m-2 bg-indigo-800 text-white z-10 relative"
                            @click=${() => {
                                this.showClipping = true;
                                this.render();
                            }}
                        >
                            Show clipping
                        </button>
                    </div>
                `;
            } else {
                return "";
            }
        }
    }

    // this is helper for app-root innerHtml
    public template() {
        return html`
            <!--   template -->
            <canvas class="top-0 absolute w-full h-full" id="3dview"> </canvas>
            ${this.showButtonsTemplate()}
            <div class="bottom-0 right-0 absolute bg-indigo-800 text-white m-2 p-2 flex flex-col">
                ${this.getIFCDataAsHtml(this.data)}
            </div>
            ${this.showClippingTools()}
        `;
    }
}
