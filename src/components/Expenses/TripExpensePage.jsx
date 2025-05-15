import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TripExpensesPage = () => {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "Food",
    splitBetween: [],
  });

  useEffect(() => {
    // Fetch expenses
    fetch(`http://localhost:1500/api/expenses/trip/${tripId}`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then(setExpenses)
      .catch(console.error);

    // Fetch participants
    fetch(`http://localhost:1500/api/trips/${tripId}/participants`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then(setParticipants)
      .catch(console.error);
  }, [tripId]);

  const handleCheckboxChange = (userId) => {
    setForm((prev) => {
      const updated = prev.splitBetween.includes(userId)
        ? prev.splitBetween.filter((id) => id !== userId)
        : [...prev.splitBetween, userId];
      return { ...prev, splitBetween: updated };
    });
  };

  const handleSubmit = (e) => {

    console.log(form)
    e.preventDefault();
    fetch("http://localhost:1500/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ ...form, trip: tripId }),
    })
      .then((res) => res.json())
      .then((newExp) => {
        setExpenses((prev) => [...prev, newExp]);
        setForm({ amount: "", description: "", category: "Food", splitBetween: [] });
      });
  };

  return (
    <div>
      <h2>Trip Expenses</h2>
      <ul>
        {expenses.map((e) => (
          <li key={e._id}>
            {e.payer?.firstName} paid {e.amount}€ for {e.description} ({e.category})
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Accommodation</option>
          <option>Activities</option>
          <option>Miscellaneous</option>
        </select>

        <div>
          <p>Split Between:</p>
          {participants.map((user) => (
            <label key={user._id} style={{ marginRight: "1rem" }}>
              <input
                type="checkbox"
                value={user._id}
                checked={form.splitBetween.includes(user._id)}
                onChange={() => handleCheckboxChange(user._id)}
              />
              {user.firstName}
            </label>
          ))}
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default TripExpensesPage;
