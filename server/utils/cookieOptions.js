/**
 * Shared cookie attributes for auth + CSRF cookies.
 *
 * In production the frontend (Vercel) and API (Render) live on different
 * domains, so requests are cross-site. For the browser to send cookies on
 * those cross-site, credentialed requests they must be `SameSite=None; Secure`.
 * Locally everything is same-site over http, so `SameSite=Lax` (no Secure) is
 * used to keep dev working without HTTPS.
 *
 * Override with COOKIE_SAMESITE if you run a single-host deployment.
 */
const cookieBaseOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax');

  return {
    sameSite,
    // `SameSite=None` REQUIRES Secure; also secure any prod cookie.
    secure: isProd || sameSite === 'none'
  };
};

module.exports = { cookieBaseOptions };
