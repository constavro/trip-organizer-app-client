import React, { useEffect, useState } from "react"
import { Link, Route, useHistory } from "react-router-dom"

function Home() {
  let history = useHistory()

  const handleLogout = async () => {

    localStorage.removeItem('token');

    const token = localStorage.getItem('token');

    console.log(token)

    window.location.href = '/signin';

  };

  return (
    <React.Fragment>
      <nav>
        <ul>
          <li><Link to='/'>Profile</Link></li>
        </ul>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </React.Fragment>
  )
}

export default Home