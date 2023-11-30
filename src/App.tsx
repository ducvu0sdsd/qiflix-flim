import './App.css';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import RoutesElement from './RoutesElement';
import { Provider } from './Components/Context';


function App() {

  return (
    <div className="App">
      <Provider>
        <Router>
          <RoutesElement />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
