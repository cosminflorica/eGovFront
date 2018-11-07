import React, { Component } from 'react'
import Login from './components/login/Login'
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom"
import Formular from './components/formular/Formular'
class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>   
          <Route exact={true} path="/" component={Login} />
          <Route path = "/formular" component = {Formular} />       
        </div>
      </HashRouter>
      
    );
  }
}

export default App;
