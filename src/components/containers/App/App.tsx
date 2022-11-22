import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';


import './App.css';

export const App = () => {
  return (
    <Router>
      <Switch>
        {/* <Route exact path={ErrorPagePath} component={ErrorPage}/> */}
        {/* <Route path="/*">
          <Redirect to={ErrorPagePath}/>
        </Route> */}
      </Switch>
    </Router>
  );
}
