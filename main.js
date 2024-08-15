import './style.css';

import { BaseAlloy } from './src/alloy/compound/base/alloy';

import { App } from './src/alloy/compound/app';
import { Page } from './src/alloy/compound/page';


/*
const performanceLog = console.log.bind(console);
console.log = (function() {}).bind(console);
*/
document.addEventListener(
    'DOMContentLoaded', () =>
  
      //performanceLog('+++ Total Render Time ...', performance.now() , ' +++')
      console.log('+++ Total Render Time ...', performance.now() , ' +++')
  );


customElements.define('base-alloy', BaseAlloy);

customElements.define('alloy-app', App);
customElements.define('alloy-page', Page);
