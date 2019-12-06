import React from "react";
import { Switch } from "react-router-dom";
import AppliedRoute from "./Components/AppliedRoutes/AppliedRoutes";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NotFound from "./Pages/NotFound/NotFound";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute exact path="/" component={Home} appProps={appProps} />
      <AppliedRoute path="/about" component={About} appProps={appProps} />
      <AppliedRoute
        path="/dashboard"
        component={Dashboard}
        appProps={appProps}
      />
      <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
      <AppliedRoute component={NotFound} />
    </Switch>
  );
}
