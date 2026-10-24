'use strict';
// =============================================================================
// PhoneStore – Standardized Response and Sanitization Utilities
// =============================================================================

function sanitizeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sendSuccess(res, message, data = {}, status = 200, extra = {}) {
  // Sets anti-cache headers for secure stateful operations
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const payload = {
    success: true,
    message: message || 'Thao tác thành công',
    data: data,
    ...extra
  };

  // Shallow copy top-level keys from data for backward-compatibility with tests
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    for (const key of Object.keys(data)) {
      if (!(key in payload)) {
        payload[key] = data[key];
      }
    }
  }

  return res.status(status).json(payload);
}

function sendError(res, message, status = 400, errorCode = 'BAD_REQUEST', details = null) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const payload = {
    success: false,
    message: message || 'Yêu cầu không hợp lệ',
    data: details,
    error: errorCode
  };

  if (details && typeof details === 'object') {
    for (const key of Object.keys(details)) {
      if (!(key in payload)) {
        payload[key] = details[key];
      }
    }
  }

  return res.status(status).json(payload);
}

module.exports = {
  sanitizeHtml,
  sendSuccess,
  sendError
};
