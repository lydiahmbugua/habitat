import { BrowserRouter, Route, Routes } from "react-router-dom"; // FIX: removed unused Navigate import
import Landing from "./components/Landing/Landing.jsx"; // ADD
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import HabitDetail from "./components/HabitDetail/HabitDetail.jsx";
import "./App.css";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx"; // ADD
import Settings from "./components/Settings/Settings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/settings" element={<Settings />} />
        <Route
          path="/habit/:habitId"
          element={
            <ProtectedRoute>
              <HabitDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
