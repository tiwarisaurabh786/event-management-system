const BASE = "http://localhost:8080/api";

const handleResponse = async (res) => {
  let data = null;

  try {
    data = await res.json();
  } catch (e) {}

  // 🔥 AUTO LOGOUT ON TOKEN EXPIRE / FORBIDDEN
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
};

// ---------- AUTH ----------
export const loginApi = (body) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handleResponse);

export const registerApi = (body) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handleResponse);

// ---------- EVENTS ----------
export const getEvents = (token) =>
  fetch(`${BASE}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

  export const getStudentEvents = (token) =>
  fetch(`${BASE}/events/available`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

export const createEvent = (event, token) =>
  fetch(`${BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  }).then(handleResponse);

  export const updateEvent = (id, event, token) =>
  fetch(`${BASE}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  }).then(handleResponse);

  // ❌ DELETE EVENT (ADMIN)
export const deleteEvent = (id, token) =>
  fetch(`${BASE}/events/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

// ---------- REGISTRATION ----------
export const registerEvent = (id, token) =>
  fetch(`${BASE}/registrations/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

export const myRegistrations = (token) =>
  fetch(`${BASE}/registrations/my`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

  export const unregisterEvent = (id, token) =>
  fetch(`${BASE}/registrations/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(handleResponse);

// 🔥 NEW API - Registration by ID with event details
export const getRegistrationById = (registrationId, token) =>
  fetch(`${BASE}/registrations/${registrationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);


export const getEventById = (id, token) =>
  fetch(`${BASE}/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

export const getEventStudents = (id, token) =>
  fetch(`${BASE}/events/${id}/students`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);


