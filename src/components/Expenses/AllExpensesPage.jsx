// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const AllExpensesPage = () => {
//   const [balances, setBalances] = useState([]);

//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/mybalances`, {
//       headers: { Authorization: localStorage.getItem("token") },
//     })
//       .then((res) => res.json())
//       .then(setBalances)
//       .catch(console.error);
//   }, []);

//   return (
//     <div className="expenses-page-container all-expenses-page">
//       <h2>My Trip Expenses</h2>
//       <ul className="balances-list">
//         {balances.map((b) => (
//           <li key={b.tripId}>
//             <Link to={`/expenses/${b.tripId}`}>
//               {b.tripTitle} - Balance: {b.balance} €
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AllExpensesPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Expenses.css'; // Import consolidated CSS

const AllExpensesPage = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your expenses.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/mybalances`, {
      headers: { Authorization: token },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({ message: 'Failed to fetch balances' }));
          throw new Error(errData.message);
        }
        return res.json();
      })
      .then(setBalances)
      .catch(err => {
        setError(err.message || 'Could not load expense balances.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="loading-message">Loading expense balances...</p>;
  if (error) return <p className="error-message container">{error}</p>;

  return (
    <div className="expenses-page-container container"> {/* Added container for centering */}
      <h2>My Trip Expense Balances</h2>
      {balances.length === 0 ? (
        <p className="empty-state-message">
          <h4>No Balances Found</h4>
          You haven't participated in any trips with expenses yet, or no expenses have been added to your trips.
        </p>
      ) : (
        <ul className="balances-list">
          {balances.map((b) => (
            <li key={b.tripId} className="balances-list-item">
              <Link to={`/expenses/${b.tripId}`}>
                {b.tripTitle || 'Unnamed Trip'} - <span className="balance-amount">Balance: {b.balance != null ? b.balance : 'N/A'} €</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllExpensesPage;