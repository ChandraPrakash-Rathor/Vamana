import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import 'bootstrap/dist/css/bootstrap.min.css';   // Must be here for Bootstrap to work at all
import './styles/global.css';                   // Your theme – put after Bootstrap
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);