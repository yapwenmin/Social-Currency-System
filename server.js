const express = require('express');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
app.use(express.json());

const db = new Low(new JSONFile('db.json'));

async function initDB() {
  await db.read();
  db.data ||= { users: [], activities: [], rewards: [] };
  // populate example data if empty
  if (db.data.users.length === 0) {
    db.data.users.push({ id: 1, name: 'Alice', credits: 0 });
    db.data.users.push({ id: 2, name: 'Bob', credits: 0 });
    db.data.users.push({ id: 3, name: 'Chloe', credits: 0 });
    db.data.users.push({ id: 4, name: 'Dan', credits: 0 });
    db.data.users.push({ id: 5, name: 'Eva', credits: 0 });
  }
  if (db.data.rewards.length === 0) {
    db.data.rewards.push({ id: 1, name: '10% Grocery Discount', cost: 5 });
    db.data.rewards.push({ id: 2, name: 'Yoga Session', cost: 3 });
    db.data.rewards.push({ id: 3, name: 'Community T-shirt', cost: 2 });
  }
  await db.write();
}

initDB();

// GET /userCredits?userId=1
app.get('/userCredits', async (req, res) => {
  const userId = Number(req.query.userId);
  await db.read();
  const user = db.data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ userId, credits: user.credits });
});

// POST /logActivity { userId, description, hours }
app.post('/logActivity', async (req, res) => {
  const { userId, description, hours } = req.body;
  if (!userId || !hours) return res.status(400).json({ error: 'Missing data' });
  await db.read();
  const user = db.data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const todayLogs = db.data.activities.filter(a => a.userId === userId && new Date(a.timestamp).toDateString() === new Date().toDateString());
  const totalHoursToday = todayLogs.reduce((sum, a) => sum + a.hours, 0);
  if (totalHoursToday + hours > 5) {
    return res.status(400).json({ error: 'Daily limit exceeded' });
  }

  const activity = { id: nanoid(), userId, description, hours, timestamp: new Date().toISOString(), approved: false };
  db.data.activities.push(activity);
  await db.write();
  res.json({ message: 'Activity logged, pending approval', activity });
});

// POST /redeemReward { userId, rewardId }
app.post('/redeemReward', async (req, res) => {
  const { userId, rewardId } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.id === userId);
  const reward = db.data.rewards.find(r => r.id === rewardId);
  if (!user || !reward) return res.status(404).json({ error: 'Not found' });
  if (user.credits < reward.cost) return res.status(400).json({ error: 'Insufficient credits' });

  user.credits -= reward.cost;
  await db.write();
  res.json({ message: 'Reward redeemed', reward });
});

// GET /availableRewards
app.get('/availableRewards', async (req, res) => {
  await db.read();
  res.json(db.data.rewards);
});

// Minimal admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'admin.html')));

// Admin approve endpoint
// POST /admin/approve { activityId }
app.post('/admin/approve', async (req, res) => {
  const { activityId } = req.body;
  await db.read();
  const activity = db.data.activities.find(a => a.id === activityId);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  if (activity.approved) return res.json({ message: 'Already approved' });
  activity.approved = true;
  const user = db.data.users.find(u => u.id === activity.userId);
  user.credits += activity.hours; // 1 hour = 1 credit
  await db.write();
  res.json({ message: 'Activity approved' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
