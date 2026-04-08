const BASE_URL = "http://localhost:8080/api/v1/quantities";

const jsonFetch = async (url, options) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
};

export const api = {
  convert: (body) =>
    jsonFetch(`${BASE_URL}/convert`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  compare: (body) =>
    jsonFetch(`${BASE_URL}/compare`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  add: (body) =>
    jsonFetch(`${BASE_URL}/add`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  subtract: (body) =>
    jsonFetch(`${BASE_URL}/subtract`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  divide: (body) =>
    jsonFetch(`${BASE_URL}/divide`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  history: (op) =>
    jsonFetch(`${BASE_URL}/history/operation/${op}`, {
      method: "GET",
    }),
};