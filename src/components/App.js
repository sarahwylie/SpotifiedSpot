import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Stats from "./pages/Stats";


//Developer Note:
//Please for every page we create we have to include {import React from "react";}
//or it will not render.
const App = () => (
  <div>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/stats" component={Stats} />
      </Switch>
    </Router>
  </div>
);

export default App;