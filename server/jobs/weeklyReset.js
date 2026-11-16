const cron = require('node-cron')
const resetWeek = require('../utils/resetWeek')

// Every Sunday at midnight (server local time)
// Cron expression: second(opt) minute hour day-of-month month day-of-week
cron.schedule('0 0 * * 0', async () => {
  console.log('[WeeklyReset] Cron triggered at', new Date().toISOString())
  try {
    await resetWeek()
  } catch (err) {
    console.error('[WeeklyReset] Cron error:', err.message)
  }
})

console.log('[WeeklyReset] Cron job scheduled — runs every Sunday at midnight.')
