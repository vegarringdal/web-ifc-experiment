import { html } from "lit-html";
import { customElement } from "@simple-html/core";

@customElement("app-root")
export default class extends HTMLElement {
  public render() {
    return html`
      <span class="inline-block p-2 m-2 bg-indigo-800 text-white">hello world</span> `;
  }
}
