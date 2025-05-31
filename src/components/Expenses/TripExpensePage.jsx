import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import './Expenses.css'; // Import consolidated CSS

const TripExpensesPage = () => {
  const { tripId } = useParams();
  const [tripTitle, setTripTitle] = useState(''); // For displaying trip name
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "Food", // Default category
    splitBetween: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTripData = useCallback(async () => {
    if (!token || !tripId) {
      setError("Missing information to load expenses.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Fetch trip details (for title) and participants
      const tripDetailsRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${tripId}`, {
        headers: { Authorization: token },
      });
      if (!tripDetailsRes.ok) throw new Error('Failed to fetch trip details.');
      const tripData = await tripDetailsRes.json();
      setTripTitle(tripData.title || 'Trip Expenses');
      // Assuming participants are part of tripData or fetched separately
      setParticipants(tripData.participants || []);
      if (tripData.participants && tripData.participants.length > 0) {
        // Auto-select all participants by default for convenience
         setForm(prev => ({ ...prev, splitBetween: tripData.participants.map(p => p._id) }));
      }


      // Fetch expenses
      const expensesRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/trip/${tripId}`, {
        headers: { Authorization: token },
      });
      if (!expensesRes.ok) throw new Error('Failed to fetch expenses for this trip.');
      const expensesData = await expensesRes.json();
      setExpenses(expensesData);

    } catch (err) {
      setError(err.message || "Could not load trip expenses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tripId, token]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);


  const handleCheckboxChange = (userId) => {
    setForm((prev) => {
      const updatedSplit = prev.splitBetween.includes(userId)
        ? prev.splitBetween.filter((id) => id !== userId)
        : [...prev.splitBetween, userId];
      return { ...prev, splitBetween: updatedSplit };
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.amount || parseFloat(form.amount) <= 0) {
        setFormError("Amount must be greater than zero.");
        return;
    }
    if (!form.description.trim()) {
        setFormError("Description is required.");
        return;
    }
    if (form.splitBetween.length === 0) {
        setFormError("Please select at least one participant to split the expense with.");
        return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...form,
          trip: tripId,
          amount: parseFloat(form.amount) // Ensure amount is a number
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add expense.");
      }
      const newExp = await res.json();
      setExpenses((prev) => [...prev, newExp]);
      // Reset form, keeping default split if participants exist
      const defaultSplit = participants.length > 0 ? participants.map(p => p._id) : [];
      setForm({ amount: "", description: "", category: "Food", splitBetween: defaultSplit });
    } catch (err) {
        setFormError(err.message);
        console.error("Add expense error:", err);
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <p className="loading-message">Loading trip expenses...</p>;
  if (error) return <p className="error-message container">{error}</p>;

  return (
    <div className="expenses-page-container container">
      <h2>Expenses for: {tripTitle}</h2>
      <div className="trip-expenses-content-grid">
        <section className="expenses-list-section card">
          <h3>Current Expenses</h3>
          {expenses.length === 0 ? (
            <p className="empty-state-message">No expenses recorded for this trip yet.</p>
          ) : (
            <ul className="expenses-list">
              {expenses.map((exp) => (
                <li key={exp._id} className="expense-item">
                  <div className="expense-details">
                    <span className="expense-payer">{exp.payer?.firstName || 'Payer'}</span> paid for {exp.description}
                    {exp.category && <span className="expense-category">{exp.category}</span>}
                  </div>
                  <span className="expense-amount">{exp.amount?.toFixed(2) || '0.00'}€</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="add-expense-form-section card">
          <h3>Add New Expense</h3>
          {formError && <p className="error-message">{formError}</p>}
          <form onSubmit={handleSubmit} className="add-expense-form">
            <div className="form-group">
              <label htmlFor="amount">Amount (€)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="e.g., 25.50"
                value={form.amount}
                onChange={handleFormChange}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="e.g., Groceries, Taxi fare"
                value={form.description}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleFormChange}
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Activities">Activities</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>

            {participants.length > 0 && (
              <div className="form-group split-between-options">
                <label className="split-label">Split Between:</label>
                <div className="participant-checkbox-group">
                {participants.map((user) => (
                  <label key={user._id} htmlFor={`user-${user._id}`} className="form-check-label">
                    <input
                      type="checkbox"
                      id={`user-${user._id}`}
                      value={user._id}
                      checked={form.splitBetween.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                    {user.firstName}
                  </label>
                ))}
                </div>
              </div>
            )}
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default TripExpensesPage;