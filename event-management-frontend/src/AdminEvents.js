import { useCallback, useEffect, useState } from "react";
import { 
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStudents,
  getEventById
} from "./api";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({
    title: "",
    venue: "",
    category: "",
    speaker: "",
    maxCapacity: "",
    description: "",
    dateTime: ""
  });
  const [editId, setEditId] = useState(null);
  const [eventId, setEventId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);

  const token = localStorage.getItem("token");

  // Load all events
  const loadEvents = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError("");
      const res = await getEvents(token);
      const eventsList = Array.isArray(res?.data) ? res.data : [];
      const normalized = eventsList.map(e => ({
        ...e,
        id: Number(e.id),
        maxCapacity: Number(e.maxCapacity)
      }));
      setEvents(normalized);
    } catch (e) {
      setError(e.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load single event by ID
  const loadEvent = async () => {
    if (!eventId || !token) {
      setError("Please enter a valid Event ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await getEventById(eventId, token);
      const eventData = res?.data || {};
      setEvent({
        title: eventData.title || "",
        venue: eventData.venue || "",
        category: eventData.category || "",
        speaker: eventData.speaker || "",
        maxCapacity: eventData.maxCapacity || "",
        description: eventData.description || "",
        dateTime: eventData.dateTime || ""
      });
      setStudents([]);
      setEditId(eventData.id);
    } catch (e) {
      setError(e.message || "Event not found");
    } finally {
      setLoading(false);
    }
  };

  // Load students for event
  const loadStudents = async () => {
    if (!eventId || !token) {
      setError("Please enter a valid Event ID first");
      return;
    }

    try {
      setLoadingStudents(true);
      setError("");
      const res = await getEventStudents(eventId, token);
      setStudents(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e.message || "Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  // Create/Update event
  const submitEvent = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError("Please login first");
      return;
    }

    if (!event.title.trim() || !event.venue.trim() || !event.maxCapacity) {
      setError("Title, venue, and capacity are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const eventData = {
        title: event.title.trim(),
        venue: event.venue.trim(),
        category: event.category.trim() || null,
        speaker: event.speaker.trim() || null,
        maxCapacity: Number(event.maxCapacity),
        description: event.description.trim() || null,
        dateTime: event.dateTime.trim() || null
      };

      if (editId) {
        await updateEvent(editId, eventData, token);
      } else {
        await createEvent(eventData, token);
      }

      setEvent({
        title: "",
        venue: "",
        category: "",
        speaker: "",
        maxCapacity: "",
        description: "",
        dateTime: ""
      });
      setEditId(null);
      setEventId("");
      setStudents([]);
      await loadEvents();
      
      // Success feedback
      const action = editId ? "updated" : "created";
      setError(`Event ${action} successfully!`);
      
      setTimeout(() => setError(""), 3000);
    } catch (e) {
      setError(e.message || `Failed to ${editId ? "update" : "create"} event`);
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!editId || !token) return;
    
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteEvent(editId, token);
      setEvent({
        title: "",
        venue: "",
        category: "",
        speaker: "",
        maxCapacity: "",
        description: "",
        dateTime: ""
      });
      setEditId(null);
      setEventId("");
      setStudents([]);
      await loadEvents();
    } catch (e) {
      setError(e.message || "Failed to delete event");
    }
  };

  useEffect(() => {
    if (token) {
      loadEvents();
    }
  }, [token, loadEvents]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "32px",
          padding: "24px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          boxShadow: "0 8px 32px rgba(240, 147, 251, 0.3)"
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "700" }}>
          Admin Event Management
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "16px" }}>
          Create, edit, and manage events ({events.length} total)
        </p>
      </div>

      {/* Event Form */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0"
          }}
        >
          <h2 style={{ margin: "0 0 20px 0", color: "#2c3e50", fontSize: "24px" }}>
            {editId ? "Edit Event" : "Create New Event"}
          </h2>

          <form onSubmit={submitEvent}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#495057" }}>
                  Title *
                </label>
                <input
                  placeholder="Event title"
                  value={event.title}
                  onChange={(e) => setEvent({ ...event, title: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "15px"
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#495057" }}>
                  Venue *
                </label>
                <input
                  placeholder="Event venue"
                  value={event.venue}
                  onChange={(e) => setEvent({ ...event, venue: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "15px"
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#495057" }}>
                  Category
                </label>
                <input
                  placeholder="e.g. Tech, Workshop"
                  value={event.category}
                  onChange={(e) => setEvent({ ...event, category: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "15px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#495057" }}>
                  Speaker
                </label>
                <input
                  placeholder="Speaker name"
                  value={event.speaker}
                  onChange={(e) => setEvent({ ...event, speaker: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "15px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#495057" }}>
                  Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="100"
                  value={event.maxCapacity}
                  onChange={(e) => setEvent({ ...event, maxCapacity: Number(e.target.value) || "" })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "15px"
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#495057" }}>
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Event description..."
                  value={event.description}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                  disabled={loading}
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "15px",
                    resize: "vertical"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#495057" }}>
                  Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={event.dateTime || ""}
                  onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "15px"
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{ 
                marginBottom: "16px", 
                padding: "12px", 
                background: "#f8d7da", 
                borderRadius: "8px", 
                border: "1px solid #f5c6cb",
                color: "#721c24",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: loading ? "#6c757d" : "#28a745",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Processing..." : editId ? "Update Event" : "Create Event"}
              </button>
              
              {editId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    padding: "14px 20px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "16px",
                    cursor: "pointer"
                  }}
                >
                  Delete Event
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Event ID Lookup Section */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0"
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", color: "#2c3e50", fontSize: "20px" }}>
            Load Event by ID
          </h3>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
                Event ID
              </label>
              <input
                type="number"
                placeholder="Enter event ID"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  fontSize: "15px"
                }}
              />
            </div>
            <button
              onClick={loadEvent}
              disabled={loading || !eventId}
              style={{
                padding: "14px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: loading || !eventId ? "#6c757d" : "#007bff",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "15px",
                cursor: (loading || !eventId) ? "not-allowed" : "pointer",
                whiteSpace: "nowrap"
              }}
            >
              Load Event
            </button>
          </div>
        </div>
      </div>

      {/* Students Section */}
      {students.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "20px" }}>
                Registered Students ({students.length})
              </h3>
              <button
                onClick={() => {
                  setStudents([]);
                  setEventId("");
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #6c757d",
                  background: "transparent",
                  color: "#6c757d",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Clear
              </button>
            </div>
            
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {students.map((student) => (
                <div
                  key={student.id}
                  style={{
                    padding: "12px 16px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    background: "#f8f9fa",
                    borderLeft: "3px solid #007bff"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#2c3e50" }}>
                    {student.name || "N/A"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {student.email || "No email"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
