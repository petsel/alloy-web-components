import './style.css';

import { App } from './src/alloy/compound/app';
import { Page } from './src/alloy/compound/page';

// import { BaseAlloy } from './src/alloy';
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

// debugger;
// new (BaseAlloy.from(HTMLElement));
// // new (BaseAlloy.from(HTMLButtonElement));

customElements.define('base-alloy', BaseAlloy);

customElements.define('alloy-app', App);
customElements.define('alloy-page', Page);
