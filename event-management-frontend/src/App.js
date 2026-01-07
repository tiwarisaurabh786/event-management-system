import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Register from "./Register";
import StudentEvents from "./StudentEvents";
import MyRegistrations from "./MyRegistrations";
import AdminEvents from "./AdminEvents";
import Events from "./Events";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f6fa"
        }}
      >
        <Navbar />
        <main style={{ padding: "0 16px 32px" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/student-events"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentEvents />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my"
              element={
                <ProtectedRoute role="STUDENT">
                  <MyRegistrations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/events"
              element={
                <ProtectedRoute role="ADMIN">
                  <Events />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-events"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminEvents />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
