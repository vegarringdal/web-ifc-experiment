import { html, render } from "lit-html";
import { ViewController } from "viewer/controller";

export class AppRoot extends HTMLElement {
    viewController: ViewController;

    public connectedCallback() {
        render(this.template(), this);
        this.viewController = new ViewController('3dview')
        this.viewController.addEventListener(this)
    }

    handleEvent(e:any){
        console.log(e)
    }

    public template() {
        return html`
            <!--   template -->
            <canvas class="top-0 absolute w-full h-full" id="3dview"> </canvas>
            <label class="inline-block p-2 m-2 bg-indigo-300 z-10 relative">
                <input class="hidden" @change=${async (e: any) => {
                        this.viewController.readFile(e.target.files[0])
                }}
                type = "file"
                value=""
                />
                open file
                </label>`;
    }
}
