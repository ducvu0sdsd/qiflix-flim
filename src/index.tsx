import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
axios.defaults.baseURL = 'https://qiflix-be.vercel.app';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);