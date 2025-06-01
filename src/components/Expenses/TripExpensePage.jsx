import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import './Expenses.css';

const EXPENSE_CATEGORIES = [
    "Food & Drinks", "Groceries", "Restaurants & Cafes",
    "Transportation", "Flights", "Trains", "Buses & Taxis", "Fuel", "Rental Car",
    "Accommodation", "Hotel", "Hostel", "Vacation Rental",
    "Activities & Entertainment", "Tours", "Tickets & Events", "Souvenirs", "Shopping",
    "Health & Wellness", "Fees & Charges", "Utilities", "Gifts", "Miscellaneous"
];

const DEFAULT_CURRENCY = 'EUR';

const TripExpensesPage = () => {
  const { tripId } = useParams();
  const [tripTitle, setTripTitle] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [tripParticipants, setTripParticipants] = useState([]);
  const [tripOrganizerId, setTripOrganizerId] = useState(null);

  const getInitialFormState = (participants = [], currentCurrency = DEFAULT_CURRENCY) => ({
    _id: null,
    amount: "",
    currency: currentCurrency,
    description: "",
    category: EXPENSE_CATEGORIES[0],
    expenseDate: new Date().toISOString().split('T')[0],
    splitType: "equally",
    splitBetween: participants.map(p => ({ user: p._id, name: p.firstName, profilePhoto: p.profilePhoto })),
    notes: "",
  });

  const [form, setForm] = useState(getInitialFormState());
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const currentUserId = localStorage.getItem("userId");
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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/trip/${tripId}`, {
        headers: { Authorization: token },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: 'Failed to fetch trip expense data.' }));
        throw new Error(errData.message || 'Failed to fetch trip expense data.');
      }
      const data = await res.json();
      setTripTitle(data.tripTitle || 'Trip Expenses');
      setTripParticipants(data.participants || []);
      setExpenses(data.expenses || []);
      setTripOrganizerId(data.tripOrganizerId || null);

      if (!isEditing) { // Only reset form if not currently editing
        setForm(getInitialFormState(data.participants || [], form.currency));
      }
    } catch (err) {
        setError(err.message || "Could not load trip expenses.");
        console.error("Fetch trip data error:", err);
    } finally { setLoading(false); }
  }, [tripId, token, isEditing, form.currency]); // Added form.currency to deps for getInitialFormState

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

    const tripBalances = useMemo(() => {
      if (!currentUserId || expenses.length === 0 || tripParticipants.length === 0) {
          return { overall: 0, breakdown: [] };
      }
  
      const userBalances = {};
      tripParticipants.forEach(p => userBalances[p._id] = 0);
      // Ensure current user is in balances, even if not in tripParticipants (e.g. only organizer)
      if (userBalances[currentUserId] === undefined) {
        userBalances[currentUserId] = 0;
      }
  
      expenses.forEach(exp => {
          const payerId = exp.payer._id;
          const amount = exp.amount;
  
          if (userBalances[payerId] !== undefined) {
              userBalances[payerId] += amount;
          }
  
          if (exp.splitDetails && exp.splitDetails.participants) {
              const { type, participants: splitParticipants } = exp.splitDetails;
              const numSplitParticipants = splitParticipants.length;

              if (numSplitParticipants === 0) return; // Avoid division by zero

              splitParticipants.forEach(sp => {
                  const participantUserId = sp.user._id;
                  if (userBalances[participantUserId] === undefined) return; 
                  
                  let share = 0;
                  if (type === 'equally') {
                      share = amount / numSplitParticipants;
                  } else if (type === 'unequally_by_amount') {
                      share = sp.amountOwed || 0;
                  }
                  userBalances[participantUserId] -= share;
              });
          }
      });
      
      const currentUserBalance = userBalances[currentUserId] || 0;
      
      // Create breakdown: who owes current user, or whom current user owes
      const breakdown = [];
      Object.entries(userBalances).forEach(([userId, balance]) => {
        if (userId === currentUserId) return; // Don't compare current user to themselves

        const otherUser = tripParticipants.find(p => p._id === userId);
        if (!otherUser) return; // Should not happen if data is consistent

        // If current user owes otherUser, otherUser's balance will be positive
        // If otherUser owes current user, otherUser's balance will be negative
        // We want to display this from the current user's perspective.
        // Example:
        // My balance: -50 (I owe 50 overall)
        // UserA balance: +30 (UserA is owed 30 by the group, could be from me)
        // UserB balance: +20 (UserB is owed 20 by the group, could be from me)

        // Simpler approach: If my balance is positive, others might owe me.
        // If my balance is negative, I might owe others.
        // The individual balances in userBalances are net for each person *within the group*
        // For "who owes whom" specifically related to the current user:
        // If userBalances[otherUserId] is positive, they are owed money by the group. Some of this might be "from me".
        // If userBalances[otherUserId] is negative, they owe money to the group. Some of this might be "to me".
        
        // This calculation is complex for a simple "who owes whom direct pairs".
        // The current `tripBalances.overall` correctly shows what the current user owes or is owed in total.
        // The `breakdown` here is showing each *other* person's net balance within the trip.
        // This might be confusing. A true "who owes whom" might require a settlement algorithm.
        // For now, let's adjust the display text for clarity based on `currentUserBalance`.

        if (currentUserBalance > 0 && balance < 0) { // I am owed overall, and this person owes the group
            breakdown.push({
                userId,
                name: `${otherUser.firstName} ${otherUser.lastName || ''}`.trim(),
                // This is tricky: how much of what they owe goes to me?
                // For simplicity, let's show their net debt to the group if I am owed.
                message: `${otherUser.firstName} owes ${Math.abs(balance).toFixed(2)} ${form.currency}`,
                profilePhoto: otherUser.profilePhoto
            });
        } else if (currentUserBalance < 0 && balance > 0) { // I owe overall, and this person is owed by the group
             breakdown.push({
                userId,
                name: `${otherUser.firstName} ${otherUser.lastName || ''}`.trim(),
                message: `You might owe ${otherUser.firstName} (they are owed ${balance.toFixed(2)} ${form.currency} by the group)`,
                profilePhoto: otherUser.profilePhoto
            });
        }
        // Other cases are more complex (e.g. we both owe, or we both are owed)
      });
  
      return { overall: parseFloat(currentUserBalance.toFixed(2)), breakdown };
    }, [expenses, currentUserId, tripParticipants, form.currency]); // Added form.currency

  const handleFormChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setFormError('');};
  
  const handleSplitTypeChange = (e) => {
    const newSplitType = e.target.value;
    setForm(prev => ({
        ...prev, splitType: newSplitType,
        // Reset amounts if switching type, but keep selected participants
        splitBetween: prev.splitBetween.map(p => ({ ...p, amountOwed: '' })) 
    }));
    setFormError('');
  };

  const handleParticipantSplitValueChange = (userId, field, value) => {
    setForm(prev => ({ ...prev, splitBetween: prev.splitBetween.map(p => p.user === userId ? { ...p, [field]: value } : p) }));
    setFormError('');
  };

  const handleParticipantSelectionChange = (userId, userName, profilePhoto) => {
    setForm(prev => {
      const isSelected = prev.splitBetween.some(p => p.user === userId);
      if (isSelected) {
        return { ...prev, splitBetween: prev.splitBetween.filter(p => p.user !== userId) };
      } else {
        return { ...prev, splitBetween: [...prev.splitBetween, { user: userId, name: userName, profilePhoto: profilePhoto, amountOwed: '' }] };
      }
    });
    setFormError('');
  };

  const validateForm = () => {
    if (!form.amount || parseFloat(form.amount) <= 0) { setFormError("Amount must be greater than zero."); return false; }
    if (!form.description.trim()) { setFormError("Description is required."); return false; }
    if (form.splitBetween.length === 0 && tripParticipants.length > 0) { // Only if there are participants to select
         setFormError("Please select at least one participant to split with."); return false; 
    }
    if (form.splitType === 'unequally_by_amount') {
        const totalAmountInput = parseFloat(form.amount);
        const sumSplitAmounts = form.splitBetween.reduce((sum, p) => sum + (parseFloat(p.amountOwed) || 0), 0);
        if (Math.abs(totalAmountInput - sumSplitAmounts) > 0.01) {
            setFormError(`Sum of split amounts (${sumSplitAmounts.toFixed(2)}) must equal total expense (${totalAmountInput.toFixed(2)}).`); return false;
        }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateForm()) return;
    setSubmitting(true);

    const payload = {
        trip: tripId, amount: parseFloat(form.amount), currency: form.currency,
        description: form.description, category: form.category, expenseDate: form.expenseDate,
        notes: form.notes,
        splitDetails: {
          type: form.splitType,
          participants: form.splitBetween.map(p => ({
            user: p.user,
            amountOwed: form.splitType === 'unequally_by_amount' ? parseFloat(p.amountOwed) || 0 : undefined,
          })),
        },
      };
    
    const url = isEditing && form._id 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/expenses/${form._id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/expenses`;
    const method = isEditing && form._id ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(payload),
          });
        if (!res.ok) { const errData = await res.json(); throw new Error(errData.message || `Failed to ${isEditing ? 'update' : 'add'} expense.`); }
        const resultExpense = await res.json();

        if (isEditing) {
            setExpenses(prev => prev.map(exp => exp._id === resultExpense._id ? resultExpense : exp).sort((a,b) => new Date(b.expenseDate) - new Date(a.expenseDate)));
        } else {
            setExpenses(prev => [resultExpense, ...prev].sort((a,b) => new Date(b.expenseDate) - new Date(a.expenseDate)));
        }
        
        setForm(getInitialFormState(tripParticipants, form.currency)); // Reset form, keep currency
        setIsEditing(false);

    } catch (err) { setFormError(err.message); console.error("Submit expense error:", err);
    } finally { setSubmitting(false); }
  };

  const handleEdit = (expenseToEdit) => {
    setIsEditing(true);
    setForm({
        _id: expenseToEdit._id,
        amount: expenseToEdit.amount.toString(),
        currency: expenseToEdit.currency || DEFAULT_CURRENCY,
        description: expenseToEdit.description,
        category: expenseToEdit.category,
        expenseDate: new Date(expenseToEdit.expenseDate).toISOString().split('T')[0],
        splitType: expenseToEdit.splitDetails.type,
        splitBetween: expenseToEdit.splitDetails.participants.map(p_split => {
            // p_split.user is populated by backend: { _id, firstName, profilePhoto }
            return {
                user: p_split.user._id,
                name: p_split.user.firstName,
                profilePhoto: p_split.user.profilePhoto,
                amountOwed: p_split.amountOwed !== undefined ? p_split.amountOwed.toString() : '',
            };
        }),
        notes: expenseToEdit.notes || "",
    });
    document.querySelector('.add-expense-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense? This action cannot be undone.")) return;
    
    setSubmitting(true);
    try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/${expenseId}`, {
            method: "DELETE",
            headers: { Authorization: token },
        });
        if (!res.ok) { const errData = await res.json().catch(() => ({message: "Failed to delete expense."})); throw new Error(errData.message || "Failed to delete expense."); }
        
        setExpenses(prev => prev.filter(exp => exp._id !== expenseId));
        if (isEditing && form._id === expenseId) {
            setForm(getInitialFormState(tripParticipants, form.currency));
            setIsEditing(false);
        }
    } catch (err) { 
        setError(err.message); 
        console.error("Delete expense error:", err);
    } finally {
        setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setForm(getInitialFormState(tripParticipants, form.currency));
    setFormError('');
  };

  const canModifyExpense = (expensePayerId) => {
    return currentUserId === expensePayerId || currentUserId === tripOrganizerId;
  };

  if (loading) return <p className="loading-message container">Loading trip expenses...</p>;
  if (error) return <p className="error-message container">{error}</p>;

  return (
    <div className="expenses-page-container container">
      <div className="page-header">
        <h2>Expenses for: {tripTitle}</h2>
        <div className="trip-balance-overview card">
            <h3>Your Balance Summary for this Trip</h3>
            {tripBalances.overall === 0 && <p className="balance-settled">You are all settled up for this trip!</p>}
            {tripBalances.overall > 0 && <p className="balance-positive">You are owed: {tripBalances.overall.toFixed(2)} {form.currency}</p>}
            {tripBalances.overall < 0 && <p className="balance-negative">You owe: {Math.abs(tripBalances.overall).toFixed(2)} {form.currency}</p>}
            
            {tripBalances.breakdown.length > 0 && (
                <details className="balance-breakdown-details">
                    <summary>Show Balance Details</summary>
                    <ul>
                        {tripBalances.breakdown.map(item => (
                            <li key={item.userId}>
                                {item.profilePhoto && <img src={item.profilePhoto} alt={item.name} className="avatar-small-inline"/>}
                                {item.message}
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </div>
      </div>
      
      <div className="trip-expenses-content-grid">
        <section className="expenses-list-section card">
          <h3>Recorded Expenses</h3>
          {expenses.length === 0 ? ( <p className="empty-state-message">No expenses recorded yet.</p> ) : (
            <ul className="expenses-list">
              {expenses.map((exp) => (
                <li key={exp._id} className="expense-item">
                  <div className="expense-main-info">
                    <span className="expense-date">{new Date(exp.expenseDate).toLocaleDateString()}</span>
                    <strong className="expense-description">{exp.description}</strong>
                    <span className="expense-category-badge">{exp.category}</span>
                  </div>
                  <div className="expense-financials">
                    Paid by: 
                    {exp.payer?.profilePhoto && <img src={exp.payer.profilePhoto} alt={exp.payer.firstName} className="avatar-small-inline"/>}
                    <Link to={`/profile/${exp.payer?._id}`} className="payer-link">{exp.payer?.firstName || 'N/A'}</Link>
                    <span className="total-amount">{exp.amount?.toFixed(2)} {exp.currency}</span>
                  </div>
                  {exp.splitDetails?.participants && exp.splitDetails.participants.length > 0 && (
                    <div className="expense-split-info">
                        Split {exp.splitDetails.type.replace('_by_amount', '')}:
                        <ul className="split-participant-list">
                        {exp.splitDetails.participants.map(p => (
                            <li key={p.user._id}>
                            {p.user.profilePhoto && <img src={p.user.profilePhoto} alt={p.user.firstName} className="avatar-small-inline"/>}
                            <Link to={`/profile/${p.user._id}`}>{p.user.firstName || 'User'}</Link>:
                            {exp.splitDetails.type === 'equally' && exp.splitDetails.participants.length > 0 && ` (${(exp.amount / exp.splitDetails.participants.length).toFixed(2)} ${exp.currency})`}
                            {exp.splitDetails.type === 'unequally_by_amount' && ` (${(p.amountOwed || 0).toFixed(2)} ${exp.currency})`}
                            </li>
                        ))}
                        </ul>
                    </div>
                  )}
                  {canModifyExpense(exp.payer._id) && (
                    <div className="expense-actions">
                        <button onClick={() => handleEdit(exp)} className="btn btn-sm btn-outline-primary" disabled={submitting}>Edit</button>
                        <button onClick={() => handleDelete(exp._id)} className="btn btn-sm btn-outline-danger" disabled={submitting}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="add-expense-form-section card">
          <h3 className={isEditing ? "editing-mode" : ""}>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h3>
          {formError && <p className="error-message">{formError}</p>}
          <form onSubmit={handleSubmit} className="add-expense-form">
            <div className="form-row">
                <div className="form-group" style={{flex: 3}}>
                    <label htmlFor="amount">Amount</label>
                    <input type="number" id="amount" name="amount" placeholder="e.g., 25.50" value={form.amount} onChange={handleFormChange} step="0.01" required />
                </div>
                <div className="form-group" style={{flex: 1}}>
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" value={form.currency} onChange={handleFormChange}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        {/* Add more common currencies */}
                    </select>
                </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input type="text" id="description" name="description" placeholder="e.g., Groceries, Taxi fare" value={form.description} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleFormChange}>
                {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
                <label htmlFor="expenseDate">Date of Expense</label>
                <input type="date" id="expenseDate" name="expenseDate" value={form.expenseDate} onChange={handleFormChange} required />
            </div>
            
            <div className="form-group">
                <label htmlFor="splitType">Split Method</label>
                <select id="splitType" name="splitType" value={form.splitType} onChange={handleSplitTypeChange}>
                    <option value="equally">Equally</option>
                    <option value="unequally_by_amount">Unequally (by specific amounts)</option>
                </select>
            </div>

            {tripParticipants.length > 0 && (
              <div className="form-group split-between-options">
                <label className="split-label">Split Among ({form.splitBetween.length} selected):</label>
                <div className="participant-checkbox-group">
                  {tripParticipants.map((user) => {
                    const currentParticipantInForm = form.splitBetween.find(p => p.user === user._id);
                    return (
                        <div key={user._id} className="participant-split-item">
                        <label htmlFor={`user-select-${user._id}`} className="form-check-label">
                            <input type="checkbox" id={`user-select-${user._id}`}
                                checked={!!currentParticipantInForm}
                                onChange={() => handleParticipantSelectionChange(user._id, user.firstName, user.profilePhoto)} />
                            {user.profilePhoto && <img src={user.profilePhoto} alt={user.firstName} className="avatar-small-inline"/>}
                            {user.firstName} {user.lastName}
                        </label>
                        {currentParticipantInForm && form.splitType === 'unequally_by_amount' && (
                            <input type="number" className="split-value-input" placeholder={`Amount`}
                                value={currentParticipantInForm.amountOwed || ''}
                                onChange={(e) => handleParticipantSplitValueChange(user._id, 'amountOwed', e.target.value)}
                                step="0.01" min="0" /> 
                        )}
                        </div>
                    );
                  })}
                </div>
                {form.splitType === 'unequally_by_amount' && form.splitBetween.length > 0 && (
                    <div className="split-total-validation">
                        Total Specified: {form.splitBetween.reduce((sum, p) => sum + (parseFloat(p.amountOwed) || 0), 0).toFixed(2)} {form.currency}
                        <br/>(Must match Expense Amount: {parseFloat(form.amount || 0).toFixed(2)} {form.currency})
                    </div>
                )}
              </div>
            )}
             <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea id="notes" name="notes" value={form.notes} onChange={handleFormChange} rows="3" placeholder="Any extra details..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting || (form.splitType === 'unequally_by_amount' && Math.abs(parseFloat(form.amount || 0) - form.splitBetween.reduce((sum, p) => sum + (parseFloat(p.amountOwed) || 0), 0)) > 0.01 && form.splitBetween.length > 0 )}>
              {submitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Expense')}
            </button>
            {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} style={{marginTop: '10px'}} disabled={submitting}>
                    Cancel Edit
                </button>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default TripExpensesPage;