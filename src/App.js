import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Shared/Header';
import UserProfile from './components/Users/UserProfile/UserProfile';
import HostDashboard from './components/Users/HostDashboard';
import TripCreationForm from './components/Trips/TripCreationForm/TripCreationForm';
import TripByUser from './components/Trips/TripByUser';
import TripDetails from './components/Trips/TripDetails/TripDetails';
import TripList from './components/Trips/TripList';
import BookingForm from './components/Bookings/BookingForm';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import LandingPage from './components/Shared/LandingPage';
import ChatPage from './components/Chat/ChatPage';
import AllChatsPage from './components/Chat/AllChatsPage';
import AllExpensesPage from './components/Expenses/AllExpensesPage';
import TripExpensesPage from './components/Expenses/TripExpensePage';
import AuthPage from './components/Auth/AuthPage';

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />


          <Route path="/trips" element={<ProtectedRoute><Header /><TripList /></ProtectedRoute>} />
          <Route path="/host/dashboard" element={<ProtectedRoute><Header /><HostDashboard /></ProtectedRoute>} />
          <Route path="/trips/:id/book" element={<ProtectedRoute><Header /><BookingForm /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Header /><UserProfile /></ProtectedRoute>} />
          <Route path="/mytrips" element={<ProtectedRoute><Header /><TripByUser /></ProtectedRoute>} />
         {/* <Route path="/coworking-spaces" element={<CoworkingSpaces />} /> */}
         {/* <Route path="/activities" element={<Activities />} /> */}
         {/* <Route path="/messages" element={<Messages />} /> */}
         {/* <Route path="/reviews" element={<Reviews />} /> */}       
         <Route path="/allexpenses" element={<ProtectedRoute><Header /><AllExpensesPage /></ProtectedRoute>}/>
<Route path="/expenses/:tripId" element={<ProtectedRoute><Header /><TripExpensesPage /></ProtectedRoute>} />

         <Route path="/chats" element={<ProtectedRoute><Header /><AllChatsPage /></ProtectedRoute>} />   
         <Route path="/chat/:id" element={<ProtectedRoute><Header /><ChatPage /></ProtectedRoute>} />
          <Route path="/createtrip" element={<ProtectedRoute><Header /><TripCreationForm /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><Header /><TripDetails /></ProtectedRoute>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    alert("You need to log in to access this page."); // Show alert
    return <Navigate to="/" />;
  }
  else {
    return children
  }
};

export default App;