import { useEffect, useState, useCallback, useMemo } from "react";
import {
  registerEvent,
  getStudentEvents
} from "./api";

const BASE = "http://localhost:8080/api";

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registerLoading, setRegisterLoading] = useState({});
  
  //  FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const token = localStorage.getItem("token");

  //  LOAD DATA - Perfect backend sync
  const loadData = useCallback(async () => {
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [eventsRes, myEventsRes] = await Promise.all([
        getStudentEvents(token),
        fetch(`${BASE}/registrations/my/events`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
      ]);

      const eventsData = Array.isArray(eventsRes?.data)
        ? eventsRes.data.map(event => ({
            ...event,
            id: Number(event.id),
            remainingSeats: Number(event.remainingSeats),
            maxCapacity: Number(event.maxCapacity)
          }))
        : [];

      const registeredEventIds = Array.isArray(myEventsRes?.data)
        ? myEventsRes.data.map(id => Number(id))
        : [];

      const eventsWithStatus = eventsData.map(event => ({
        ...event,
        isRegistered: registeredEventIds.includes(event.id)
      }));

      setEvents(eventsWithStatus);
      setAllEvents(eventsWithStatus);
      setError("");
    } catch (error) {
      console.error("Load error:", error);
      setError(error.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  //  ENHANCED FILTER LOGIC
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents];

    // Search by title OR speaker OR description
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        (event.speaker && event.speaker.toLowerCase().includes(searchLower)) ||
        (event.description && event.description.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(event => 
        event.category === selectedCategory
      );
    }

    // Date/Seats filter
    if (selectedDate !== "all") {
      filtered = filtered.filter(event => {
        if (selectedDate === "urgent") return event.remainingSeats <= 5;
        if (selectedDate === "many") return event.remainingSeats > 10;
        if (selectedDate === "today") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const eventDate = new Date(event.date_time);
          return eventDate.toDateString() === today.toDateString();
        }
        return true;
      });
    }

    return filtered;
  }, [allEvents, searchTerm, selectedCategory, selectedDate]);

  //  Categories
  const categories = useMemo(() => {
    const catSet = allEvents.reduce((acc, event) => {
      if (event.category) acc.add(event.category);
      return acc;
    }, new Set());
    return ["all", ...Array.from(catSet)];
  }, [allEvents]);

  //  Date formatter
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "📅 Date TBA";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' • ' + 
             date.toLocaleTimeString('en-IN', { 
               hour: 'numeric', 
               minute: '2-digit' 
             });
    } catch {
      return "📅 Invalid date";
    }
  }, []);

  //  REGISTER
  const handleRegister = async (eventId) => {
    if (!token) {
      setError("Please login first");
      return;
    }

    const event = allEvents.find(e => e.id === eventId);
    if (!event || event.isRegistered || event.remainingSeats <= 0) return;

    setRegisterLoading(prev => ({ ...prev, [eventId]: true }));
    setError("");

    try {
      await registerEvent(eventId, token);
      
      const updateEvent = (eventsArray) =>
        eventsArray.map(e =>
          e.id === eventId
            ? {
                ...e,
                isRegistered: true,
                remainingSeats: Math.max(0, e.remainingSeats - 1)
              }
            : e
        );

      setEvents(updateEvent(events));
      setAllEvents(updateEvent(allEvents));
    } catch (err) {
      const errorMsg = err.message?.toLowerCase() || "";
      if (errorMsg.includes("already registered")) {
        const syncEvent = (eventsArray) =>
          eventsArray.map(e =>
            e.id === eventId ? { ...e, isRegistered: true } : e
          );
        setEvents(syncEvent(events));
        setAllEvents(syncEvent(allEvents));
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setRegisterLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        flexDirection: "column"
      }}>
        <div style={{ fontSize: "18px", color: "#666" }}>
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "60px 20px",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <div style={{ color: "#dc3545", fontSize: "16px", marginBottom: "20px" }}>
          {error}
        </div>
        <button
          onClick={loadData}
          style={{
            padding: "10px 24px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px" 
    }}>
      {/*  HEADER */}
      <div style={{ 
        marginBottom: "30px",
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)"
      }}>
        <h1 style={{ 
          margin: "0 0 8px 0", 
          fontSize: "32px", 
          fontWeight: "700" 
        }}>
          🎉 Available Events ({allEvents.length})
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "16px" }}>
          {filteredEvents.length} events match your filters
        </p>
      </div>

      {/*  FILTERS BAR H Ye */}
      <div style={{ 
        background: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: "30px",
        border: "1px solid #e8e8e8"
      }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
          alignItems: "end"
        }}>
          {/* Search */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600", 
              color: "#333",
              fontSize: "14px"
            }}>
              🔍 Search Events
            </label>
            <input
              type="text"
              placeholder="Search by title, speaker or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "#007bff"}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600", 
              color: "#333",
              fontSize: "14px"
            }}>
              📂 Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "8px",
                fontSize: "15px",
                background: "white",
                cursor: "pointer"
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600", 
              color: "#333",
              fontSize: "14px"
            }}>
              ⏰ Availability
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "8px",
                fontSize: "15px",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="all">All Events</option>
              <option value="today">📅 Today Only</option>
              <option value="urgent">⚠️ Few Seats (≤5)</option>
              <option value="many">🎯 Many Seats (>10)</option>
            </select>
          </div>

          {/* Clear */}
          <div style={{ paddingTop: "36px" }}>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedDate("all");
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.target.style.background = "#5a6268"}
              onMouseLeave={(e) => e.target.style.background = "#6c757d"}
            >
              🧹 Clear All
            </button>
          </div>
        </div>
      </div>

      {/*  EVENTS */}
      {filteredEvents.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 20px",
          color: "#666",
          background: "#fafafa",
          borderRadius: "16px",
          border: "1px dashed #ddd"
        }}>
          <div style={{ fontSize: "28px", marginBottom: "16px" }}>
            No events match your filters
          </div>
          <p style={{ fontSize: "16px", marginBottom: "24px" }}>
            Try adjusting your search or filters above
          </p>
          <button
            onClick={loadData}
            style={{
              padding: "14px 28px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            🔄 Reload Events
          </button>
        </div>
      ) : (
        filteredEvents.map(event => {
          const isBusy = !!registerLoading[event.id];
          const isRegistered = !!event.isRegistered;
          const isFull = event.remainingSeats <= 0;
          const disabled = isBusy || isRegistered || isFull;

          return (
            <div
              key={event.id}
              style={{
                padding: "28px",
                border: `2px solid ${isRegistered ? "#28a745" : "#e0e0e0"}`,
                borderRadius: "20px",
                marginBottom: "28px",
                background: "white",
                boxShadow: isRegistered 
                  ? "0 12px 32px rgba(40, 167, 69, 0.2)" 
                  : "0 8px 24px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}
            >
              {/*  HEADER */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start", 
                marginBottom: "24px",
                gap: "24px"
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: "0 0 12px 0", 
                    color: "#1a1a1a",
                    fontSize: "28px",
                    fontWeight: "700",
                    lineHeight: "1.3"
                  }}>
                    {event.title}
                  </h3>
                  
                  {event.category && (
                    <div style={{ 
                      background: "#e3f2fd", 
                      color: "#1976d2", 
                      padding: "8px 20px", 
                      borderRadius: "30px",
                      display: "inline-block",
                      fontSize: "15px",
                      fontWeight: "600",
                      marginBottom: "16px",
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)"
                    }}>
                      {event.category}
                    </div>
                  )}
                </div>

                {/*  SEATS BADGE */}
                <div style={{ 
                  textAlign: "center", 
                  padding: "16px 12px",
                  background: event.remainingSeats <= 2 ? "#f8d7da" : "#d4edda",
                  borderRadius: "16px",
                  border: `3px solid ${event.remainingSeats <= 2 ? "#dc3545" : "#28a745"}`,
                  minWidth: "120px"
                }}>
                  <div style={{ 
                    fontSize: "32px", 
                    fontWeight: "800", 
                    color: event.remainingSeats <= 2 ? "#dc3545" : "#28a745",
                    lineHeight: "1"
                  }}>
                    {event.remainingSeats}
                  </div>
                  <div style={{ fontSize: "13px", opacity: 0.9 }}>Seats Left</div>
                </div>
              </div>

              {/*  DETAILS GRID */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                gap: "20px", 
                marginBottom: "24px"
              }}>
                <div>
                  <strong style={{ color: "#555", fontSize: "15px" }}>📍 Venue</strong>
                  <div style={{ fontWeight: "600", color: "#222", marginTop: "6px", fontSize: "16px" }}>
                    {event.venue}
                  </div>
                </div>

                <div>
                  <strong style={{ color: "#555", fontSize: "15px" }}>📅 Date & Time</strong>
                  <div style={{ color: "#666", marginTop: "6px", fontSize: "15px" }}>
                    {formatDate(event.date_time)}
                  </div>
                </div>

                {event.speaker && (
                  <div>
                    <strong style={{ color: "#555", fontSize: "15px" }}>🎤 Speaker</strong>
                    <div style={{ fontWeight: "500", color: "#333", marginTop: "6px" }}>
                      {event.speaker}
                    </div>
                  </div>
                )}

                <div>
                  <strong style={{ color: "#555", fontSize: "15px" }}>👥 Total Capacity</strong>
                  <div style={{ color: "#666", marginTop: "6px" }}>
                    {event.maxCapacity}
                  </div>
                </div>
              </div>

              {/*  DESCRIPTION */}
              {event.description && (
                <div style={{ 
                  marginBottom: "28px",
                  padding: "24px",
                  background: "#f8f9fa",
                  borderRadius: "16px",
                  borderLeft: "5px solid #007bff"
                }}>
                  <strong style={{ 
                    color: "#495057", 
                    fontSize: "17px", 
                    display: "block", 
                    marginBottom: "12px" 
                  }}>
                    📖 About this event:
                  </strong>
                  <div style={{ lineHeight: "1.7", color: "#444", fontSize: "15px" }}>
                    {event.description}
                  </div>
                </div>
              )}

              {/*  STATUS */}
              <div style={{
                marginBottom: "28px",
                padding: "20px",
                background: isRegistered ? "#d4edda" : "#d1ecf1",
                borderRadius: "16px",
                borderLeft: `6px solid ${isRegistered ? "#28a745" : "#17a2b8"}`,
                color: isRegistered ? "#155724" : "#0c5460",
                fontWeight: "700",
                fontSize: "19px",
                textAlign: "center"
              }}>
                {isRegistered 
                  ? "🎉 You're REGISTERED for this event!" 
                  : `🚀 ${event.remainingSeats} spots available - Register now!`
                }
              </div>

              {/*  REGISTER BUTTON */}
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => handleRegister(event.id)}
                  disabled={disabled}
                  style={{
                    background: isBusy 
                      ? "#6c757d" 
                      : isRegistered 
                        ? "#28a745" 
                        : isFull 
                          ? "#dc3545" 
                          : "#007bff",
                    color: "white",
                    padding: "18px 48px",
                    border: "none",
                    borderRadius: "16px",
                    cursor: disabled ? "not-allowed" : "pointer",
                    fontSize: "18px",
                    fontWeight: "700",
                    minWidth: "260px",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      e.target.style.background = isRegistered 
                        ? "#218838" 
                        : isFull 
                          ? "#c82333" 
                          : "#0056b3";
                      e.target.style.transform = "translateY(-4px)";
                      e.target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled) {
                      e.target.style.background = isBusy 
                        ? "#6c757d" 
                        : isRegistered 
                          ? "#28a745" 
                          : isFull 
                            ? "#dc3545" 
                            : "#007bff";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)";
                    }
                  }}
                >
                  {isBusy 
                    ? "⏳ Registering..." 
                    : isRegistered 
                      ? "✅ Registered ✓" 
                      : isFull 
                        ? "🛑 Event Full" 
                        : "📝 Register Now"
                  }
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
