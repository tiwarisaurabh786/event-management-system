import { useEffect, useState, useCallback } from "react";
import { myRegistrations, unregisterEvent } from "./api";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [unregisterLoading, setUnregisterLoading] = useState({});

  const token = localStorage.getItem("token");

  const loadData = useCallback(async () => {
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await myRegistrations(token);
      const list = Array.isArray(res?.data) ? res.data : [];
      setRegistrations(list);
      setError("");
    } catch (e) {
      setError(e.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUnregister = async (registrationId) => {
    if (!token) {
      setError("Please login first");
      return;
    }

    setUnregisterLoading(prev => ({ ...prev, [registrationId]: true }));
    setError("");

    try {
      await unregisterEvent(registrationId, token);

      setRegistrations(prev => prev.filter(r => r.id !== registrationId));
    } catch (err) {
      setError(err.message || "Unregister failed");
    } finally {
      setUnregisterLoading(prev => ({ ...prev, [registrationId]: false }));
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading your registrations...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: "700px",
        margin: "40px auto",
        textAlign: "center"
      }}>
        <p style={{ color: "#dc3545", marginBottom: "20px", fontSize: "16px" }}>
          {error}
        </p>
        <button
          onClick={loadData}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          marginBottom: "24px",
          padding: "20px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          color: "white",
          boxShadow: "0 6px 20px rgba(17, 153, 142, 0.35)"
        }}
      >
        <h2 style={{ margin: "0 0 6px 0", fontSize: "26px", fontWeight: "700" }}>
          My Registrations
        </h2>
        <p style={{ margin: 0, opacity: 0.9 }}>
          You have {registrations.length} active
          {registrations.length === 1 ? " registration" : " registrations"}.
        </p>
      </div>

      {registrations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#666",
            borderRadius: "12px",
            background: "#fafafa",
            border: "1px dashed #ddd"
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "10px" }}>
            No registrations found
          </div>
          <p style={{ marginBottom: 0 }}>
            Go to the events page to register for a new event.
          </p>
        </div>
      ) : (
        registrations.map((r) => {
          const isBusy = !!unregisterLoading[r.id];
          const event = r.event || {};
          const user = r.user || {};
          const registeredAt = r.registeredAt
            ? new Date(r.registeredAt).toLocaleString("en-IN")
            : "N/A";

          return (
            <div
              key={r.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "18px 20px",
                marginBottom: "16px",
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                alignItems: "center"
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "6px", fontSize: "15px", color: "#555" }}>
                  <strong>Registration ID:</strong>{" "}
                  <span style={{ color: "#007bff" }}>{r.id}</span>
                </div>

                <div style={{ marginBottom: "6px" }}>
                  <strong>Event:</strong>{" "}
                  <span style={{ fontWeight: "600", color: "#222" }}>
                    {event.title || "Unknown event"}
                  </span>
                </div>

                {event.venue && (
                  <div style={{ marginBottom: "4px", color: "#555" }}>
                    <strong>Venue:</strong> {event.venue}
                  </div>
                )}

                {event.category && (
                  <div
                    style={{
                      display: "inline-block",
                      marginBottom: "6px",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      background: "#e3f2fd",
                      color: "#1976d2",
                      fontSize: "13px",
                      fontWeight: "500"
                    }}
                  >
                    {event.category}
                  </div>
                )}

                {event.speaker && (
                  <div style={{ marginBottom: "4px", color: "#555" }}>
                    <strong>Speaker:</strong> {event.speaker}
                  </div>
                )}

                <div style={{ marginBottom: "4px", color: "#555" }}>
                  <strong>Registered at:</strong> {registeredAt}
                </div>

                {user.name && (
                  <div style={{ marginBottom: 0, color: "#555" }}>
                    <strong>User:</strong> {user.name}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleUnregister(r.id)}
                disabled={isBusy}
                style={{
                  background: isBusy ? "#6c757d" : "#dc3545",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isBusy ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  minWidth: "140px",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isBusy) e.target.style.background = "#c82333";
                }}
                onMouseLeave={(e) => {
                  if (!isBusy) e.target.style.background = "#dc3545";
                }}
              >
                {isBusy ? "⏳ Unregistering..." : "❌ Unregister"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
