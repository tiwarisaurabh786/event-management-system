import { useEffect, useState, useCallback } from "react";
import { getEvents } from "./api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadEvents = useCallback(async () => {
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await getEvents(token);
      const eventsList = Array.isArray(res?.data) ? res.data : [];
      
      // Normalize IDs to numbers
      const normalizedEvents = eventsList.map(event => ({
        ...event,
        id: Number(event.id),
        maxCapacity: Number(event.maxCapacity)
      }));
      
      setEvents(normalizedEvents);
    } catch (e) {
      console.error("Failed to load events:", e);
      setError(e.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

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
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: "900px",
        margin: "40px auto",
        textAlign: "center"
      }}>
        <p style={{ color: "#dc3545", marginBottom: "20px", fontSize: "16px" }}>
          {error}
        </p>
        <button
          onClick={loadEvents}
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
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "30px",
          padding: "24px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)"
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "700" }}>
          All Events (Admin)
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "16px" }}>
          Manage {events.length} total events
        </p>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "#666",
            borderRadius: "12px",
            background: "#fafafa",
            border: "1px dashed #ddd"
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>
            No events found
          </div>
          <p style={{ fontSize: "16px", marginBottom: "24px" }}>
            No events have been created yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {events.map((event) => {
            const category = event.category || "General";
            const speaker = event.speaker || "TBA";
            const hasDescription = event.description && event.description.trim();

            return (
              <div
                key={event.id}
                style={{
                  padding: "24px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "16px",
                  background: "white",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  borderLeft: `5px solid ${
                    category === "Premium Class"
                      ? "#28a745"
                      : category === "business event"
                      ? "#007bff"
                      : "#6c757d"
                  }`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "22px", 
                      color: "#1a1a1a",
                      fontWeight: "700"
                    }}>
                      {event.title}
                    </h3>
                    <div style={{ 
                      display: "inline-block", 
                      padding: "4px 12px", 
                      borderRadius: "20px",
                      background: "#e3f2fd",
                      color: "#1976d2",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px"
                    }}>
                      {category}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ 
                      fontSize: "32px", 
                      fontWeight: "700", 
                      color: event.maxCapacity <= 10 ? "#dc3545" : "#28a745" 
                    }}>
                      {event.maxCapacity}
                    </div>
                    <div style={{ fontSize: "13px", color: "#666" }}>Capacity</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <strong style={{ color: "#555" }}>Venue:</strong>
                    <div style={{ fontWeight: "500", color: "#222" }}>{event.venue}</div>
                  </div>
                  
                  <div>
                    <strong style={{ color: "#555" }}>Speaker:</strong>
                    <div style={{ color: "#666", fontStyle: event.speaker ? "normal" : "italic" }}>
                      {speaker}
                    </div>
                  </div>
                  
                  {hasDescription && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <strong style={{ color: "#555" }}>Description:</strong>
                      <div style={{ color: "#444", marginTop: "4px" }}>
                        {event.description}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{
                  padding: "12px 16px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  borderLeft: "3px solid #007bff",
                  fontSize: "14px",
                  color: "#495057"
                }}>
                  <strong>ID:</strong> {event.id} | 
                  <strong> Event ID:</strong> {event.id}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Refresh Button */}
      <div style={{ textAlign: "center", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e5e5e5" }}>
        <button
          onClick={loadEvents}
          style={{
            padding: "12px 24px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,123,255,0.3)"
          }}
        >
          🔄 Refresh Events
        </button>
      </div>
    </div>
  );
}
