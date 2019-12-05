import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Dashboard from "./Pages/Dashboard/Dashboard";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" exact component={Login} />
    </Switch>
  );
}
