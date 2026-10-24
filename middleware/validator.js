'use strict';
// =============================================================================
// PhoneStore – Validation Middleware (Section 5.1 Standard)
// =============================================================================
const { sendError } = require('./response');

const NAME_RE = /^[\p{L}\s]{2,50}$/u;
const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{5,49}$/;
const PHONE_RE = /^(03|05|07|08|09)\d{8}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[@#$!]).{6,}$/;

function validateRegistration(req, res, next) {
  const b = req.body || {};
  const fullName = String(b.fullName || b.name || '').trim();
  const username = String(b.username || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const phone = String(b.phone || '').trim();
  const password = String(b.password || '');

  // 1. Họ và tên: 2-50 ký tự, không chứa số hoặc ký tự đặc biệt
  if (!fullName || fullName.length < 2 || fullName.length > 50 || !NAME_RE.test(fullName)) {
    return sendError(
      res,
      'Họ và tên phải từ 2-50 ký tự và không chứa chữ số hoặc ký tự đặc biệt.',
      400,
      'VALIDATION',
      { field: 'fullName' }
    );
  }

  // 2. Tên đăng nhập: 6-50 ký tự, bắt đầu bằng chữ cái, không khoảng trắng/ký tự đặc biệt
  // If username is not explicitly provided in legacy clients, derive it or require it.
  if (b.username !== undefined || username) {
    if (!username || username.length < 6 || username.length > 50 || !USERNAME_RE.test(username)) {
      return sendError(
        res,
        'Tên đăng nhập phải từ 6-50 ký tự, bắt đầu bằng chữ cái và không chứa khoảng trắng hay ký tự đặc biệt.',
        400,
        'VALIDATION',
        { field: 'username' }
      );
    }
  }

  // 3. Email: định dạng hợp lệ
  if (!email || !EMAIL_RE.test(email)) {
    return sendError(
      res,
      'Email không đúng định dạng hợp lệ (ví dụ: name@example.com).',
      400,
      'VALIDATION',
      { field: 'email' }
    );
  }

  // 4. Số điện thoại: đúng 10 chữ số, chỉ chứa số, bắt đầu bằng 03, 05, 07, 08, 09
  if (!phone || !PHONE_RE.test(phone)) {
    return sendError(
      res,
      'Số điện thoại phải đúng 10 chữ số và bắt đầu bằng đầu số di động hợp lệ (03, 05, 07, 08, 09).',
      400,
      'VALIDATION',
      { field: 'phone' }
    );
  }

  // 5. Mật khẩu: tối thiểu 6 ký tự, ít nhất 1 chữ hoa, ít nhất 1 ký tự đặc biệt (@, #, $, !)
  if (!password || password.length < 6 || !PASSWORD_RE.test(password)) {
    return sendError(
      res,
      'Mật khẩu phải từ 6 ký tự trở lên, bao gồm ít nhất 1 chữ hoa và 1 ký tự đặc biệt (@, #, $, !).',
      400,
      'VALIDATION',
      { field: 'password' }
    );
  }

  next();
}

function validateLogin(req, res, next) {
  const b = req.body || {};
  const identifier = String(b.username || b.email || '').trim();
  const password = String(b.password || '');

  if (!identifier) {
    return sendError(res, 'Vui lòng nhập tên đăng nhập hoặc email.', 400, 'VALIDATION', { field: 'username' });
  }
  if (!password) {
    return sendError(res, 'Vui lòng nhập mật khẩu.', 400, 'VALIDATION', { field: 'password' });
  }

  next();
}

function validateOrderInput(req, res, next) {
  const b = req.body || {};
  const fullName = String(b.fullName || b.shipping_name || '').trim();
  const phone = String(b.phone || b.shipping_phone || '').trim();
  const address = String(b.address || b.shipping_address || '').trim();
  const shippingProvider = String(b.shippingProvider || b.shipping_provider || '').trim();
  const items = Array.isArray(b.items) ? b.items : [];

  if (!fullName || fullName.length < 2 || fullName.length > 50 || !NAME_RE.test(fullName)) {
    return sendError(
      res,
      'Họ và tên người nhận phải từ 2-50 ký tự và không chứa chữ số hoặc ký tự đặc biệt.',
      400,
      'VALIDATION',
      { field: 'fullName' }
    );
  }

  if (!phone || !PHONE_RE.test(phone)) {
    return sendError(
      res,
      'Số điện thoại người nhận phải đúng 10 chữ số và bắt đầu bằng đầu số hợp lệ (03, 05, 07, 08, 09).',
      400,
      'VALIDATION',
      { field: 'phone' }
    );
  }

  if (!address || address.length < 5) {
    return sendError(
      res,
      'Địa chỉ nhận hàng phải từ 5 ký tự trở lên.',
      400,
      'VALIDATION',
      { field: 'address' }
    );
  }

  const validProviders = ['GHN', 'GHTK', 'Viettel Post'];
  if (shippingProvider && !validProviders.includes(shippingProvider)) {
    return sendError(
      res,
      `Đơn vị vận chuyển không hợp lệ. Vui lòng chọn một trong: ${validProviders.join(', ')}.`,
      400,
      'VALIDATION',
      { field: 'shippingProvider' }
    );
  }

  if (items.length === 0) {
    return sendError(
      res,
      'Giỏ hàng của bạn đang trống. Thêm ít nhất một sản phẩm trước khi thanh toán.',
      400,
      'EMPTY_CART'
    );
  }

  for (const it of items) {
    const qty = Number(it.qty || it.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return sendError(
        res,
        'Số lượng mỗi sản phẩm phải là số nguyên dương lớn hơn 0.',
        400,
        'INVALID_QUANTITY'
      );
    }
  }

  next();
}

module.exports = {
  NAME_RE,
  USERNAME_RE,
  PHONE_RE,
  EMAIL_RE,
  PASSWORD_RE,
  validateRegistration,
  validateLogin,
  validateOrderInput
};
