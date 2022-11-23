import React from "react";
window.$ = require('jquery');
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { useSelector } from "react-redux";

import Home from "../components/pages/Home";
import Quiz from "../components/pages/Quiz";
import Stats from "../components/pages/Stats";


//Developer Note:
//Please for every page we create we have to include {import React from "react";}
//or it will not render.
const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/stats" component={Stats} />
        </Switch>
      </Router>
    </div>
  )
};

export default App;
