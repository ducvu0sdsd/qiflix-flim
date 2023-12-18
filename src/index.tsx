import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// axios.defaults.baseURL = 'https://qiflix-be.vercel.app';
axios.defaults.baseURL = 'http://localhost:8080';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);
