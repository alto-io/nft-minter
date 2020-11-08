import * as React from "react";
import * as ReactDOM from "react-dom";

import * as serviceWorker from './serviceWorker';

import {App} from './app'

import {AppProviders} from './context'

import {loadDevTools} from './dev-tools/load'

import 'bootstrap/dist/css/bootstrap.min.css';

declare global {
  // tslint:disable-next-line
  interface Window {
    blockies: any;
  }
}
loadDevTools(() => {
  ReactDOM.render(
    <>
        <AppProviders>
          <App />
        </AppProviders>
    </>,
    document.getElementById("root"),
  )
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
