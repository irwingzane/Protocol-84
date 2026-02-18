// Simple localStorage-based data layer for the MVP

const STORAGE_KEYS = {
  session: 'br_session',
  employees: 'br_employees',
};

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  } catch {
    // ignore for MVP
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.session);
  } catch {
    // ignore
  }
}

export function getEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.employees);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEmployees(employees) {
  try {
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees));
  } catch {
    // ignore
  }
}

export function upsertEmployee(employee) {
  const employees = getEmployees();
  const idx = employees.findIndex((e) => e.email === employee.email);
  if (idx >= 0) {
    employees[idx] = { ...employees[idx], ...employee };
  } else {
    employees.push(employee);
  }
  saveEmployees(employees);
  return employee;
}

export function updateEmployeeProgress(email, updater) {
  const employees = getEmployees();
  const idx = employees.findIndex((e) => e.email === email);
  if (idx === -1) return null;
  const current = employees[idx];
  const updated = updater(current);
  employees[idx] = updated;
  saveEmployees(employees);
  return updated;
}

