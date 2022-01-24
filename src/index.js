import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App/App';
import Firebase, { FirebaseContext } from './components/Firebase';


ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
);