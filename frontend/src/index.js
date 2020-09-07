import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker'
import axios from 'axios'


axios.interceptors.request.use(config=>{
  const token = localStorage.getItem('TOKEN_APP_TALLER')
  if(token!= null){
    config.headers.Authorization = 'Bearer ' + token
  }else{
    config.headers.Authorization = null
  }
  return config
})

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.register()