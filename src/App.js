import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Shared/Header';
import UserProfile from './components/Users/UserProfile/UserProfile';
import HostDashboard from './components/Users/HostDashboard/HostDashboard';
import TripCreationForm from './components/Trips/TripCreationForm/TripCreationForm';
import TripByUser from './components/Trips/TripByUser';
import TripDetails from './components/Trips/TripDetails/TripDetails';
import TripPage from './components/Trips/TripPage/TripPage';
import BookingForm from './components/Bookings/BookingForm';
import LandingPage from './components/Shared/LandingPage';
import ChatPage from './components/Chat/ChatPage';
import AllChatsPage from './components/Chat/AllChatsPage';
import AllExpensesPage from './components/Expenses/AllExpensesPage';
import TripExpensesPage from './components/Expenses/TripExpensePage';
import AuthPage from './components/Auth/AuthPage';
import TripAISuggestion from './components/Trips/TripCreationForm/TripAISuggestion';
import ConfirmEmail from './components/Auth/EmailConfirmation';
import ResetPassword from './components/Auth/ResetPassword';

function App() {

  return (
      <Router>
        <Routes>
          <Route path="*" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Header /><UserProfile /></ProtectedRoute>} />
          <Route path="/confirm/:token" element={<ConfirmEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/trips" element={<ProtectedRoute><Header /><TripPage /></ProtectedRoute>} />
          <Route path="/host/dashboard" element={<ProtectedRoute><Header /><HostDashboard /></ProtectedRoute>} />
          <Route path="/trips/:id/book" element={<ProtectedRoute><Header /><BookingForm /></ProtectedRoute>} />
          
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
          <Route path="/trip-ai-suggestion" element={<ProtectedRoute><Header /><TripAISuggestion/></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><Header /><TripDetails /></ProtectedRoute>} />
            
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