import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Register from "./Ahtentification/Register";
import Login from "./Ahtentification/Login";
import React from "react";
import {ContextProvider} from "./auth";

function App() {
  return (
      <ContextProvider>
          <Router>
              <Route exact path="/" component={Register} />
              <Route path="/login" component={Login} />
          </Router>
      </ContextProvider>
  );
}

export default App;
