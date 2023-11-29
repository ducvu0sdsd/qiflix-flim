import './App.css';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import RoutesElement from './RoutesElement';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';

function App() {

  // const ScrollToTop = () => {
  //   const [state, setState] = useState(true)
  //   const { pathname } = useLocation();
  //   useEffect(() => {
  //     setState(!state)
  //   }, [pathname]);

  //   return <></>
  // };

  return (
    <div className="App">
      <Router>
        <RoutesElement />
      </Router>
    </div>
  );
}

export default App;
