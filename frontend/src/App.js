import './App.css';
import { Switch, Route } from 'react-router-dom';

import Profile from './pages/Profile';

import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route path='/profile'>
          <Profile />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
