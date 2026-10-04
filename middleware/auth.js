'use strict';
// =============================================================================
// PhoneStore – Authentication middleware
// -----------------------------------------------------------------------------
// Resolves the session token from (in order):
//   1. Authorization: Bearer <token>  (used by the SPA and API test tools)
//   2. ?token=... query parameter     (handy for direct browser / JMeter hits)
//   3. phonestore_token cookie        (kept in sync on login so a plain browser
//                                      navigation to /admin still authenticates)
// and enforces route-level RBAC guards (requireAuth / requireAdmin).
// =============================================================================

const db = require('../data/db');

// Tiny cookie parser (avoids pulling in the cookie-parser dependency).
function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach((pair) => {
    const i = pair.indexOf('=');
    if (i > 0) {
      const key = pair.slice(0, i).trim();
      const raw = pair.slice(i + 1).trim();
      try {
        out[key] = decodeURIComponent(raw);
      } catch {
        out[key] = raw;
      }
    }
  });
  return out;
}

// Extracts the raw bearer token for the current request, or null.
function getToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
  if (req.query && req.query.token) return String(req.query.token).trim();
  const cookies = parseCookies(req.headers.cookie);
  return cookies.phonestore_token || null;
}

// Returns the sanitized user for a request, or null when unauthenticated.
function userFromRequest(req) {
  const token = getToken(req);
  if (!token) return null;
  const state = db.getState();
  const userId = state.sessions[token];
  if (!userId) return null;
  const user = state.users.find((u) => u.id === userId);
  return user ? db.publicUser(user) : null;
}

// 401 when no valid session is presented; attaches the user to req.user.
function requireAuth(req, res, next) {
  const user = userFromRequest(req);
  if (!user) {
    return res.status(401).json({
      error: 'AUTH_REQUIRED',
      message: 'Authentication required. Please log in to continue.'
    });
  }
  req.user = user;
  next();
}

// 401 when unauthenticated, 403 when authenticated but not an admin.
function requireAdmin(req, res, next) {
  const user = userFromRequest(req);
  if (!user) {
    return res.status(401).json({
      error: 'AUTH_REQUIRED',
      message: 'Authentication required to access admin resources.'
    });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Access denied: admin privileges are required to use this resource.'
    });
  }
  req.user = user;
  next();
}

module.exports = { parseCookies, getToken, userFromRequest, requireAuth, requireAdmin };