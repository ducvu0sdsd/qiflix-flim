import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import RoutesElement from './RoutesElement';
import PublicPage from './Pages/PublicPage';

function App() {
  return (
    <div className="App">
      <Router>
        <RoutesElement />
      </Router>
    </div>
  );
}

export default App;
