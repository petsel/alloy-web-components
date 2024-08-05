import './style.css';

import { Router } from './src/alloy/compound/composite/routing/router';
import { Route } from './src/alloy/compound/composite/routing/route';

import { App } from './src/alloy/compound/app';
import { Page } from './src/alloy/compound/page';

customElements.define('alloy-router', Router);
customElements.define('alloy-route', Route);

customElements.define('alloy-app', App);
customElements.define('alloy-page', Page);
