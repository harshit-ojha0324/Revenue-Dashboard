const crypto = require('crypto');
const { cookieBaseOptions } = require('../utils/cookieOptions');

// Methods that change server state and therefore require a CSRF check.
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const COOKIE_NAME = 'csrfToken';
const HEADER_NAME = 'x-csrf-token';

/**
 * Double-submit cookie CSRF protection.
 *
 * `attachCsrfToken` ensures every client holds a readable (non-httpOnly)
 * CSRF cookie. The SPA echoes that value back in the `X-CSRF-Token` header
 * on state-changing requests, and `verifyCsrf` confirms the two match.
 *
 * Because an attacker's cross-site page can trigger a request with the
 * victim's cookies but cannot read the cookie value to set the header,
 * forged requests fail the check.
 */
const attachCsrfToken = (req, res, next) => {
  if (!req.cookies || !req.cookies[COOKIE_NAME]) {
    const token = crypto.randomBytes(24).toString('hex');
    res.cookie(COOKIE_NAME, token, {
      httpOnly: false, // must be readable by the frontend JS
      ...cookieBaseOptions()
    });
    // Make it available to a handler in the same request (e.g. /auth/csrf).
    req.csrfToken = token;
  } else {
    req.csrfToken = req.cookies[COOKIE_NAME];
  }
  next();
};

const verifyCsrf = (req, res, next) => {
  if (!MUTATING_METHODS.includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies && req.cookies[COOKIE_NAME];
  const headerToken = req.get(HEADER_NAME);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token'
    });
  }

  next();
};

module.exports = { attachCsrfToken, verifyCsrf };
