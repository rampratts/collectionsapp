import React from 'react';
import './App.css';
import HomePage from './components/HomePage';
import Login from './components/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {ProtectedRoute} from './components/Protected.route';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/login' component={Login}/>
          <ProtectedRoute exact path='/' component={HomePage}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
