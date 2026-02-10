import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "./api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT"
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      setMsg("Name is required");
      return false;
    }
    if (!form.email.trim()) {
      setMsg("Email is required");
      return false;
    }
    if (!form.password.trim()) {
      setMsg("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      setMsg("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!validate()) return;

    try {
      setLoading(true);
      await registerApi(form);
      setMsg("Registered successfully. Redirecting to login...");
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Registration failed. Please try again.";
      setMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        padding: "24px 24px 28px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        border: "1px solid #e5e5e5"
      }}
    >
      <h2
        style={{
          margin: "0 0 16px 0",
          textAlign: "center",
          color: "#2c3e50"
        }}
      >
        Create an Account
      </h2>
      <p
        style={{
          margin: "0 0 24px 0",
          textAlign: "center",
          fontSize: "14px",
          color: "#6c757d"
        }}
      >
        Register as a student or admin to manage events.
      </p>

      <form onSubmit={submit}>
        <div style={{ marginBottom: "14px" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#495057"
            }}
          >
            Name
          </label>
          <input
            id="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange("name")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#495057"
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#495057"
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={handleChange("password")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="role"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#495057"
            }}
          >
            Role
          </label>
          <select
            id="role"
            value={form.role}
            onChange={handleChange("role")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              cursor: "pointer"
            }}
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {msg && (
          <div
            style={{
              marginBottom: "12px",
              fontSize: "13px",
              color: msg.toLowerCase().includes("success")
                ? "#28a745"
                : "#dc3545",
              textAlign: "center"
            }}
          >
            {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: loading ? "#6c757d" : "#28a745",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px"
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div
        style={{
          marginTop: "4px",
          fontSize: "13px",
          textAlign: "center",
          color: "#6c757d"
        }}
      >
        Already have an account?{" "}
        <Link
          to="/"
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
