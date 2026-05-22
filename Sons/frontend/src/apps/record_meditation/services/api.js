const BASE = "/api/record-meditation";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchCalendar() {
  return parse(await fetch(`${BASE}/calendar`));
}

export async function fetchMonth(year, month) {
  return parse(await fetch(`${BASE}/month/${year}/${month}`));
}

export async function createEntry(payload) {
  return parse(
    await fetch(`${BASE}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateEntry(id, payload) {
  return parse(
    await fetch(`${BASE}/entries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteEntry(id) {
  return parse(
    await fetch(`${BASE}/entries/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  );
}

export async function search({ q, tag } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("tag", tag);
  return parse(await fetch(`${BASE}/search?${params.toString()}`));
}

export function exportMonthUrl(year, month) {
  return `${BASE}/export/month/${year}/${String(month).padStart(2, "0")}.json`;
}
export function exportYearUrl(year) {
  return `${BASE}/export/year/${year}.zip`;
}
export function exportCsvUrl() {
  return `${BASE}/export/csv`;
}
export function exportAllUrl() {
  return `${BASE}/export/all.zip`;
}

export async function verifyPassword(password) {
  const response = await fetch(`${BASE}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) return { ok: false, error: data.error || "密码错误" };
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return { ok: true };
}

export async function changePassword(currentPassword, newPassword) {
  const response = await fetch(`${BASE}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { ok: false, error: data.error || `Request failed: ${response.status}` };
  }
  return { ok: true };
}
