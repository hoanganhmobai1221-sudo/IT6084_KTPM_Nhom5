'use strict';
// =============================================================================
// PhoneStore – Authentication routes  (/api/auth)
// -----------------------------------------------------------------------------
// POST /api/auth/register -> validates fields, blocks duplicate emails, hashes
//                            the password with bcrypt and logs the user in.
// POST /api/auth/login    -> verifies the bcrypt hash and issues a session.
// GET  /api/auth/me       -> returns the current user (requires a token).
// POST /api/auth/logout   -> destroys the server-side session.
// =============================================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../data/db');
const { getToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

// Creates a session for the user, mirrors it into a cookie, and sends the payload.
function loginResponse(res, user) {
  const token = crypto.randomUUID();
  db.getState().sessions[token] = user.id;
  res.setHeader('Set-Cookie', `phonestore_token=${token}; Path=/; Max-Age=86400; SameSite=Lax`);
  res.json({ token, user: db.publicUser(user) });
}

router.post('/register', (req, res) => {
  const b = req.body || {};
  const fullName = String(b.fullName || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const phone = String(b.phone || '').trim();
  const password = String(b.password || '');

  if (fullName.length < 2) {
    return res.status(400).json({ error: 'VALIDATION', field: 'fullName', message: 'Full name is required (at least 2 characters).' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'VALIDATION', field: 'email', message: 'Please enter a valid email address, e.g. name@example.com.' });
  }
  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'VALIDATION', field: 'phone', message: 'Please enter a valid phone number (7–20 digits).' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'VALIDATION', field: 'password', message: 'Password must be at least 6 characters long.' });
  }

  const state = db.getState();
  if (state.users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'EMAIL_EXISTS', message: `An account with email "${email}" already exists. Please log in instead.` });
  }

  const user = {
    id: 'U' + String(state.users.length + 1).padStart(3, '0'),
    fullName,
    email,
    phone,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'customer'
  };
  state.users.push(user);

  // Auto-login after a successful registration (keeps the storefront friction-free).
  res.status(201);
  loginResponse(res, user);
});

router.post('/login', (req, res) => {
  const b = req.body || {};
  const email = String(b.email || '').trim().toLowerCase();
  const password = String(b.password || '');

  // Defensive lookup: works whether db exposes .state directly or only getState(),
  // and can never crash the route even if the users store is momentarily absent.
  const users = db.state?.users || db.getState?.()?.users || [];
  const user = users.find((u) => u.email === email);

  if (!user) {
    console.log(`[login] FAILED reason=user_not_found email="${email}" knownEmails=[${users.map((u) => u.email).join(', ')}]`);
    return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
  }

  // bcryptjs hash verification – the ONLY password check (never compare plain text).
  if (!bcrypt.compareSync(password, user.passwordHash)) {
    console.log(`[login] FAILED reason=password_mismatch email="${email}" hashLength=${String(user.passwordHash || '').length}`);
    return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
  }

  console.log(`[login] OK email="${email}" userId=${user.id} role=${user.role}`);
  loginResponse(res, user);
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', requireAuth, (req, res) => {
  const token = getToken(req);
  if (token) delete db.getState().sessions[token];
  res.setHeader('Set-Cookie', 'phonestore_token=; Path=/; Max-Age=0; SameSite=Lax');
  res.json({ success: true, message: 'Logged out successfully. Session cleared.' });
});

module.exports = router;