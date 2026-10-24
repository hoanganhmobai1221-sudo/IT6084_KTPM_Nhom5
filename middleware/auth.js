'use strict';
// =============================================================================
// PhoneStore – Authentication & RBAC Middleware
// =============================================================================
const db = require('../data/db');
const { sendError } = require('./response');

// Tiny cookie parser
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

// Extracts the bearer token from headers, query param or HttpOnly cookie
function getToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
  if (req.query && req.query.token) return String(req.query.token).trim();
  const cookies = parseCookies(req.headers.cookie);
  return cookies.phonestore_token || null;
}

// Resolves sanitized user from Sessions in SQLite
function userFromRequest(req) {
  const token = getToken(req);
  if (!token) return null;

  const database = db.getDb();
  const session = database.prepare('SELECT * FROM Sessions WHERE token = ?').get(token);
  if (!session) return null;

  // Check if session expired
  if (session.expires_at && new Date(session.expires_at) < new Date()) {
    database.prepare('DELETE FROM Sessions WHERE token = ?').run(token);
    return null;
  }

  const user = database.prepare('SELECT * FROM Users WHERE id = ?').get(session.user_id);
  return user ? db.publicUser(user) : null;
}

// 401 when no valid session is presented
function requireAuth(req, res, next) {
  const user = userFromRequest(req);
  if (!user) {
    return sendError(
      res,
      'Yêu cầu đăng nhập để tiếp tục thao tác.',
      401,
      'AUTH_REQUIRED'
    );
  }
  req.user = user;
  next();
}

// 401 when unauthenticated, 403 when authenticated but not admin
function requireAdmin(req, res, next) {
  const user = userFromRequest(req);
  if (!user) {
    return sendError(
      res,
      'Yêu cầu đăng nhập quyền quản trị viên.',
      401,
      'AUTH_REQUIRED'
    );
  }
  if (user.role !== 'admin') {
    return sendError(
      res,
      'Truy cập bị từ chối: Cần quyền quản trị viên (Admin).',
      403,
      'FORBIDDEN'
    );
  }
  req.user = user;
  next();
}

module.exports = {
  parseCookies,
  getToken,
  userFromRequest,
  requireAuth,
  requireAdmin
};