import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/home';
import Add from './components/add';
import Edit from './components/edit';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/add" component={Add} />
        <Route path="/edit/:uid" component={Edit} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
