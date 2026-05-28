const BASE = "/api/daily-todo";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchPlanner() {
  return parse(await fetch(`${BASE}/planner`));
}

export async function fetchDate(date) {
  return parse(await fetch(`${BASE}/dates/${encodeURIComponent(date)}`));
}

export async function createDate(payload) {
  return parse(
    await fetch(`${BASE}/dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateDate(date, payload) {
  return parse(
    await fetch(`${BASE}/dates/${encodeURIComponent(date)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteDate(date) {
  return parse(
    await fetch(`${BASE}/dates/${encodeURIComponent(date)}`, {
      method: "DELETE",
    }),
  );
}

export async function createTodo(payload) {
  return parse(
    await fetch(`${BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateTodo(id, payload) {
  return parse(
    await fetch(`${BASE}/todos/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteTodo(id) {
  return parse(
    await fetch(`${BASE}/todos/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  );
}

export async function duplicateTodo(id, date) {
  return parse(
    await fetch(`${BASE}/todos/${encodeURIComponent(id)}/duplicate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    }),
  );
}
