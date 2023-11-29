import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import RoutesElement from './RoutesElement';
import { CSSTransition } from 'react-transition-group';

function App() {
  return (
    <div className="App">
      <Router>
        <CSSTransition
          in={true}
          timeout={3000}
          classNames="your-transition"
          unmountOnExit
        >
          <RoutesElement />
        </CSSTransition>
      </Router>
    </div>
  );
}

export default App;
