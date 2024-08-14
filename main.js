import './style.css';

import { BaseAlloy } from './src/alloy/compound/base/alloy';

import { App } from './src/alloy/compound/app';
import { Page } from './src/alloy/compound/page';

// import { Router } from './src/alloy/compound/composite/routing/router';
// import { Route } from './src/alloy/compound/composite/routing/route';


customElements.define('base-alloy', BaseAlloy);

customElements.define('alloy-app', App);
customElements.define('alloy-page', Page);

// customElements.define('alloy-router', Router);
// customElements.define('alloy-route', Route);
