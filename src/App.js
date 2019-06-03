import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/home';
import Add from './components/add';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/add" component={Add} />

      </Switch>
    </BrowserRouter>
  );
}

export default App;
