import './style.css';

import { /* html, css, */ LitElement } from 'lit';

import { App } from './src/alloy/compound/app';
import { Page } from './src/alloy/compound/page';

// import { BaseAlloy } from './src/alloy/alchemy';
import { BaseAlloy } from './src/alloy/compound/base/alloy';


/*
const performanceLog = console.log.bind(console);
console.log = (function() {}).bind(console);
*/
document.addEventListener(
    'DOMContentLoaded', () =>
  
      //performanceLog('+++ Total Render Time ...', performance.now() , ' +++')
      console.log('+++ Total Render Time ...', performance.now() , ' +++')
  );

//debugger;
// new (BaseAlloy.from(HTMLElement));
// // new (BaseAlloy.from(HTMLButtonElement));


class TestElement extends HTMLElement {
  constructor() {
    super();
//debugger;
    this.foo = 'FOO';
  }
}

class AlloyButton extends HTMLButtonElement {
  constructor() {
//    debugger;
    super();
    console.log('+++ BUTTON +++');
  }
}

customElements.define('alloy-test-element', TestElement);
// customElements.define('generic-test-element', LitElement);

// customElements.define('alloy-button', BaseAlloy.from(TestElement));
// customElements.define('alloy-button', BaseAlloy.from(LitElement));
// customElements.define('alloy-button', HTMLButtonElement);

customElements.define('alloy-button', AlloyButton, { extends: "button" });
// customElements.define('test-button', HTMLButtonElement);


customElements.define('base-alloy', BaseAlloy);


customElements.define('alloy-app', App);
customElements.define('alloy-page', Page);
