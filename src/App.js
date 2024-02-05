import React, {useState,useEffect} from 'react';
import { Switch, Redirect, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import NotFoundPage from "./pages/NotFoundPage"
import PasswordReset from "./pages/PasswordReset"
import Profile from "./pages/Profile"
import authenticationFunction from './components/authentication';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
  const checkAuthentication = async () => {

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/checkAuthentication', {
        mode: "cors",
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    });

      // console.log(response.json())

      if (response.ok) {
        const data = await response.json();
        console.log(data.authenticated)
        setLoggedIn(data.authenticated);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('Error:', error); 
      setLoggedIn(false);
    }
  };

  checkAuthentication();
}, []);


  return (
    <React.Fragment>
      <Switch>
        <Route path="/" exact component={loggedIn ? Home : SignIn} />
        <Route path='/signup' component={loggedIn ? Home : SignUp} />
        <Route path='/signin' component={loggedIn ? Home : SignIn} />
        <Route path='/passwordreset' component={loggedIn ? Home : PasswordReset} />
        <Route path='/404' component={loggedIn ? Home : NotFoundPage} />
        <Route path='/profile/:userid' component={loggedIn ? Profile : SignIn} />
        <Redirect to="/signin" />
      </Switch>
    </React.Fragment>)
}

export default App