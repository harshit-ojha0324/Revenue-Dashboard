/**
 * Live seeder — keeps the deployed demo feeling "alive" by inserting a few
 * fresh sales on a schedule, so the dashboard's numbers and charts visibly
 * change over time without anyone touching the data manually.
 *
 * Design notes:
 *  - Sales are attributed to a dedicated demo user (created on first run) so
 *    they never pollute a real account.
 *  - A hard cap (SEED_MAX_SALES) trims the oldest demo sales each tick, keeping
 *    the free-tier Atlas database (512 MB) from growing without bound.
 *  - The whole job is opt-in via ENABLE_LIVE_SEED so local dev and tests are
 *    unaffected unless you explicitly turn it on.
 *
 * Relevant env vars:
 *   ENABLE_LIVE_SEED   'true' to start the job (default: off)
 *   SEED_CRON          cron expression for the tick (default: every 2 minutes)
 *   SEED_BATCH_MIN     min sales per tick (default: 1)
 *   SEED_BATCH_MAX     max sales per tick (default: 4)
 *   SEED_MAX_SALES     cap on demo sales kept in the DB (default: 500)
 *   SEED_DEMO_EMAIL    demo account email (default: demo@sales-dashboard.local)
 *   SEED_DEMO_PASSWORD demo account password (default: random — see logs once)
 */

const cron = require('node-cron');
const crypto = require('crypto');
const User = require('../models/User');
const Sale = require('../models/Sale');
const { getRandomNumber, buildRandomSale, getRandomDate } = require('../utils/sampleData');

const DEFAULTS = {
  cron: '*/2 * * * *', // every 2 minutes
  batchMin: 1,
  batchMax: 4,
  maxSales: 500,
  demoEmail: 'demo@sales-dashboard.local',
  demoName: 'Demo User'
};

let task = null; // the scheduled cron task (so we can stop it in tests)

/**
 * Find or create the demo user that owns all generated sales.
 */
const ensureDemoUser = async () => {
  const email = process.env.SEED_DEMO_EMAIL || DEFAULTS.demoEmail;
  let user = await User.findOne({ email });
  if (user) return user;

  const password =
    process.env.SEED_DEMO_PASSWORD || crypto.randomBytes(12).toString('hex');
  user = await User.create({
    name: DEFAULTS.demoName,
    email,
    password,
    role: 'user'
  });

  console.log(`[liveSeeder] Created demo user "${email}".`);
  if (!process.env.SEED_DEMO_PASSWORD) {
    console.log(
      `[liveSeeder] Generated demo password (set SEED_DEMO_PASSWORD to control it): ${password}`
    );
  }
  return user;
};

/**
 * Insert a batch of fresh sales, then trim oldest demo sales past the cap.
 */
const runTick = async (demoUserId) => {
  const batchMin = parseInt(process.env.SEED_BATCH_MIN, 10) || DEFAULTS.batchMin;
  const batchMax = parseInt(process.env.SEED_BATCH_MAX, 10) || DEFAULTS.batchMax;
  const maxSales = parseInt(process.env.SEED_MAX_SALES, 10) || DEFAULTS.maxSales;

  const count = getRandomNumber(batchMin, Math.max(batchMin, batchMax));

  // Spread sale dates across the last ~24h so time-series charts stay lively.
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const batch = Array.from({ length: count }, () =>
    buildRandomSale(demoUserId, getRandomDate(dayAgo, now))
  );

  await Sale.insertMany(batch);

  // Trim: keep only the newest `maxSales` demo sales.
  const total = await Sale.countDocuments({ customer: demoUserId });
  if (total > maxSales) {
    const overflow = total - maxSales;
    const oldest = await Sale.find({ customer: demoUserId })
      .sort({ date: 1 })
      .limit(overflow)
      .select('_id');
    await Sale.deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
  }

  console.log(`[liveSeeder] Inserted ${count} sale(s); demo total now ~${Math.min(total, maxSales)}.`);
};

/**
 * Start the live seeder. No-op unless ENABLE_LIVE_SEED === 'true'.
 * Returns the cron task (or null when disabled / on error).
 */
const startLiveSeeder = async () => {
  if (process.env.ENABLE_LIVE_SEED !== 'true') return null;

  const expression = process.env.SEED_CRON || DEFAULTS.cron;
  if (!cron.validate(expression)) {
    console.error(`[liveSeeder] Invalid SEED_CRON "${expression}" — seeder not started.`);
    return null;
  }

  let demoUser;
  try {
    demoUser = await ensureDemoUser();
  } catch (err) {
    console.error(`[liveSeeder] Could not set up demo user: ${err.message}`);
    return null;
  }

  // Run one tick immediately so fresh deploys have data right away.
  runTick(demoUser._id).catch((err) =>
    console.error(`[liveSeeder] Initial tick failed: ${err.message}`)
  );

  task = cron.schedule(expression, () => {
    runTick(demoUser._id).catch((err) =>
      console.error(`[liveSeeder] Tick failed: ${err.message}`)
    );
  });

  console.log(`[liveSeeder] Started. Schedule: "${expression}".`);
  return task;
};

/**
 * Stop the seeder (used in tests / graceful shutdown).
 */
const stopLiveSeeder = () => {
  if (task) {
    task.stop();
    task = null;
  }
};

module.exports = { startLiveSeeder, stopLiveSeeder, ensureDemoUser, runTick };
