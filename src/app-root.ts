import { html, render } from "lit-html";
import { ViewController } from "viewer/controller";

export class AppRoot extends HTMLElement {
    viewController: ViewController;
    data: { keys: any[]; values: any[] } = { keys: [], values: [] };

    public connectedCallback() {
        this.render();
        this.viewController = new ViewController("3dview");
        this.viewController.addEventListener(this);
    }

    handleEvent(e: any) {
        // only event I have atm is from grip click event...
        if (e?.data) {
            // just store them as key/values for now
            const keys = Object.keys(e.data);
            const values = keys.map((x) => {
                if (e.data[x]?.value) {
                    return e.data[x]?.value;
                } else {
                    return e.data[x];
                }
            });

            keys.unshift("element type");
            values.unshift(e.data?.constructor?.name);

            this.data = { keys, values };
            this.render();
        }
    }

    // helper to trigger html update
    public render() {
        render(this.template(), this);
    }

    private getIFCDataAsHtml() {
        const { values, keys } = this.data;

        if (keys.length) {
            return html`
                <div class="text-center bg-indigo-500">Data:</div>
                ${keys.map((key, i) => {
                    return html`<div>
                        <span class="font-semibold">${key}:</span><span>${values[i]}</span>
                    </div>`;
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
                        this.viewController.readFile(e.target.files[0]);
                    }}
                />
                open file
            </label>

            <div class="bottom-0 right-0 absolute bg-indigo-300 m-2 p-2 flex flex-col">
                ${this.getIFCDataAsHtml()}
            </div>
        `;
    }
}
