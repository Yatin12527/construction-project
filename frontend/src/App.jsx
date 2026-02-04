import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminReview from "./pages/AdminReview"; // <--- FIXED: Added missing import

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-500 font-medium">
        Loading Procurement Engine...
      </div>
    );

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* If logged in -> Go to Dashboard. If not -> Login */}
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* If logged in -> Redirect to Dashboard. If not -> Show Login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        {/* If logged in -> Redirect to Dashboard. If not -> Show Signup */}
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        {/* FIXED: Protected Admin Route */}
        <Route
          path="/admin"
          element={user ? <AdminReview /> : <Navigate to="/login" />}
        />

        {/* Catch-all: Redirect unknown routes to Home/Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
