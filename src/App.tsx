import './App.css';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import RoutesElement from './RoutesElement';

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
