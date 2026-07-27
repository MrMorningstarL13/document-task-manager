// Central API client. All requests go through here so JWT auth and error
// handling stay consistent. The base URL defaults to "" so requests hit the
// same origin (proxied to the backend via vite.config.js during dev). Override
// with VITE_API_BASE_URL to point at an absolute backend URL.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""
const TOKEN_KEY = "hive_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

async function request(path, { method = "GET", body, headers = {}, raw = false } = {}) {
  const token = getToken()
  const finalHeaders = { ...headers }

  const isFormData = body instanceof FormData
  if (body && !isFormData) {
    finalHeaders["Content-Type"] = "application/json"
  }
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    })
  } catch (err) {
    throw new ApiError(
      "Unable to reach the server. Check that the backend is running.",
      0,
      null,
    )
  }

  if (res.status === 401) {
    setToken(null)
    // Let the app react to an expired/invalid session.
    window.dispatchEvent(new Event("hive:unauthorized"))
  }

  if (raw) {
    if (!res.ok) throw new ApiError("Request failed", res.status, null)
    return res
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`
    throw new ApiError(message, res.status, data)
  }

  return data
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  raw: (path, opts) => request(path, { ...opts, raw: true }),
}
