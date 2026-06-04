/**
 * End-to-end smoke test for the Sales Dashboard backend.
 *
 * Exercises: register -> login -> /me -> create sale -> get sales ->
 * stats, plus CSRF (403) and auth (401) guard checks. Uses the cookie jar
 * returned by the server so it validates the httpOnly cookie + CSRF flow.
 *
 * Prereqs:
 *   1. server/.env has a real MONGO_URI + JWT_SECRET (and ideally JWT_EXPIRE).
 *   2. Backend is running:  npm run server   (defaults to port 5001)
 *
 * Run (in a second terminal):
 *   node scripts/smoke-test.js
 *
 * Override the base URL if needed:
 *   BASE_URL=http://localhost:5001 node scripts/smoke-test.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5001';
const API = `${BASE_URL}/api`;

// --- tiny cookie jar -------------------------------------------------------
const jar = {};
function storeCookies(res) {
  const raw = res.headers.getSetCookie ? res.headers.getSetCookie() : res.headers.raw?.()['set-cookie'] || [];
  for (const c of raw) {
    const [pair] = c.split(';');
    const idx = pair.indexOf('=');
    jar[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
  }
}
function cookieHeader() {
  return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function req(method, path, { body, headers = {}, csrf = false } = {}) {
  const h = { 'Content-Type': 'application/json', Cookie: cookieHeader(), ...headers };
  if (csrf && jar.csrfToken) h['X-CSRF-Token'] = jar.csrfToken;
  const res = await fetch(`${API}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });
  storeCookies(res);
  let data = null;
  try { data = await res.json(); } catch { /* no body */ }
  return { status: res.status, data };
}

// --- assertions ------------------------------------------------------------
let passed = 0, failed = 0;
function check(label, cond, detail) {
  if (cond) { passed++; console.log(`  PASS  ${label}`); }
  else { failed++; console.log(`  FAIL  ${label}${detail ? ` -> ${detail}` : ''}`); }
}

(async () => {
  console.log(`\nSmoke test against ${BASE_URL}\n`);
  const stamp = Date.now();
  const email = `smoke_${stamp}@example.com`;
  const password = 'SmokeTest123!';

  try {
    // 0. bootstrap CSRF cookie
    const csrf = await req('GET', '/auth/csrf');
    check('GET /auth/csrf returns 200', csrf.status === 200, `status ${csrf.status}`);
    check('csrfToken cookie set', !!jar.csrfToken, 'no csrfToken cookie');

    // 1. register
    const reg = await req('POST', '/auth/register', {
      body: { name: 'Smoke Test', email, password },
      csrf: true,
    });
    check('POST /auth/register returns 200/201', [200, 201].includes(reg.status), `status ${reg.status}`);
    check('register sets httpOnly token cookie', !!jar.token, 'no token cookie');
    check('register does NOT leak token in JSON', !(reg.data && reg.data.token), 'token present in body');

    // 2. login (fresh jar to prove login alone authenticates)
    delete jar.token;
    const login = await req('POST', '/auth/login', {
      body: { email, password },
      csrf: true,
    });
    check('POST /auth/login returns 200', login.status === 200, `status ${login.status}`);
    check('login sets token cookie', !!jar.token, 'no token cookie');

    // 3. /me
    const me = await req('GET', '/auth/me');
    check('GET /auth/me returns 200', me.status === 200, `status ${me.status}`);
    check('/me returns correct user', me.data?.data?.email === email, JSON.stringify(me.data));

    // 4. create sale
    const sale = await req('POST', '/sales', {
      body: {
        product: 'Smoke Widget',
        category: 'Electronics',
        price: 199,
        quantity: 2,
        date: new Date().toISOString(),
        region: 'North',
        paymentMethod: 'Credit Card',
      },
      csrf: true,
    });
    check('POST /sales returns 200/201', [200, 201].includes(sale.status), `status ${sale.status} ${JSON.stringify(sale.data)}`);
    const saleId = sale.data?.data?._id;
    check('created sale has _id', !!saleId, 'no _id returned');
    check('totalAmount computed (199*2=398)', sale.data?.data?.totalAmount === 398, `got ${sale.data?.data?.totalAmount}`);

    // 5. get sales
    const list = await req('GET', '/sales');
    check('GET /sales returns 200', list.status === 200, `status ${list.status}`);
    check('GET /sales returns the new sale', Array.isArray(list.data?.data) && list.data.data.length >= 1, JSON.stringify(list.data));

    // 5b. date-range filter (regression check for the bug fixed in Phase 1)
    const today = new Date();
    const start = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);
    const end = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
    const ranged = await req('GET', `/sales?startDate=${start}&endDate=${end}`);
    check('GET /sales with date range returns the sale', Array.isArray(ranged.data?.data) && ranged.data.data.length >= 1, JSON.stringify(ranged.data));

    // 6. stats
    const stats = await req('GET', '/sales/stats');
    check('GET /sales/stats returns 200', stats.status === 200, `status ${stats.status}`);
    check('stats has a payload', !!stats.data?.data, JSON.stringify(stats.data));

    // 7. CSRF guard: mutating request WITHOUT the header should 403
    const noCsrf = await req('POST', '/sales', {
      body: { product: 'NoCsrf', category: 'Other', price: 1, quantity: 1, region: 'North', paymentMethod: 'Cash' },
      csrf: false,
    });
    check('CSRF guard blocks mutation without header (403)', noCsrf.status === 403, `status ${noCsrf.status}`);

    // 8. auth guard: hit /me with no token cookie should 401
    const savedToken = jar.token;
    delete jar.token;
    const noAuth = await req('GET', '/auth/me');
    check('Auth guard blocks /me without token (401)', noAuth.status === 401, `status ${noAuth.status}`);
    jar.token = savedToken;

    // 9. delete the sale to keep DB clean
    if (saleId) {
      const del = await req('DELETE', `/sales/${saleId}`, { csrf: true });
      check('DELETE /sales/:id returns 200', del.status === 200, `status ${del.status}`);
    }

  } catch (err) {
    failed++;
    console.log(`\n  FATAL  ${err.message}`);
    console.log('  (Is the backend running on ' + BASE_URL + '? Start it with: npm run server)');
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
})();
