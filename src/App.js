import React, { useState, useEffect } from 'react';
import { Link, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import NotFoundPage from "./pages/NotFoundPage"

// function Home(){
  // return <h1>Home</h1>
// }

function App(){
  return (
<React.Fragment>
<nav>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/signup'>SignUp</Link></li>
      <li><Link to='/signin'>SignIn</Link></li>
    </ul>
    </nav>
      <Route path="/" exact component={Home} />
      <Route path='/signup' component={SignUp} />
      <Route path='/signin' component={SignIn} />
      <Route path='/404' component={NotFoundPage} /> 
    </React.Fragment>)
}

export default App