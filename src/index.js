import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import * as serviceWorker from './serviceWorker';

// Redux imports
import { Provider } from 'react-redux';
import store from './redux/store';

// Global CSS and custom theme
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Theme.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
