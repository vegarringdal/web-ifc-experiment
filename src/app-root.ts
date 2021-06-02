import { html, render } from "lit-html";
export class AppRoot extends HTMLElement {

  public connectedCallback() {
    render(this.template(), this)
  }

  public template() {
    return html`
      <span class="inline-block p-2 m-2 bg-indigo-800 text-white">hello world</span>`;
  }
}

