import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Expenses.css';

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
      .then(data => {
        setBalances(data);
      })
      .catch(err => {
        setError(err.message || 'Could not load expense balances.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="loading-message container">Loading expense balances...</p>;
  if (error) return <p className="error-message container">{error}</p>;

  const overallBalance = balances.reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0);


  return (
    <div className="expenses-page-container container">
      <h2>My Trip Expense Balances</h2>

      {balances.length > 0 && (
        <div className="overall-balance-summary card">
          <h3>Overall Summary</h3>
          {overallBalance === 0 && <p>You are all settled up across your trips!</p>}
          {overallBalance > 0 && <p>Overall, you are owed: <span className="positive-balance">{overallBalance.toFixed(2)} {balances[0]?.currency || '...'}</span></p>}
          {overallBalance < 0 && <p>Overall, you owe: <span className="negative-balance">{Math.abs(overallBalance).toFixed(2)} {balances[0]?.currency || '...'}</span></p>}
        </div>
      )}

      {balances.length === 0 && !loading ? (
        <div className="empty-state-message card">
          <h4>No Balances Found</h4>
          <p>You haven't participated in any trips with expenses yet, or no expenses have been added to your trips.</p>
          <p>Start by <Link to="/createtrip">creating a trip</Link> or joining one!</p>
        </div>
      ) : (
        <ul className="balances-list">
          {balances.map((b) => (
            <li key={b.tripId} className="balances-list-item card"> {/* Added card class */}
              <Link to={`/expenses/${b.tripId}`}>
                <div className="balance-item-header">
                  {b.tripCoverPhoto && <img src={b.tripCoverPhoto} alt={b.tripTitle} className="trip-cover-thumbnail"/>}
                  <span className="trip-title-balance">{b.tripTitle || 'Unnamed Trip'}</span>
                </div>
                <div className="balance-details">
                    {parseFloat(b.balance) === 0 && <span className="balance-amount settled">Settled up</span>}
                    {parseFloat(b.balance) > 0 && <span className="balance-amount positive-balance">You are owed: {b.balance} {b.currency}</span>}
                    {parseFloat(b.balance) < 0 && <span className="balance-amount negative-balance">You owe: {Math.abs(parseFloat(b.balance))} {b.currency}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllExpensesPage;