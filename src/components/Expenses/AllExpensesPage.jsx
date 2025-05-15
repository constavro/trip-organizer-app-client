import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllExpensesPage = () => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/mybalances`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then(setBalances)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>My Trip Expenses</h2>
      <ul>
        {balances.map((b) => (
          <li key={b.tripId}>
            <Link to={`/expenses/${b.tripId}`}>
              {b.tripTitle} - Balance: {b.balance} €
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllExpensesPage;
