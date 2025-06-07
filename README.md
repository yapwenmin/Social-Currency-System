# Social Currency System / Community Credits

This is a small demo implementation of a "Community Credits" module for a
TimeBanking system in the Gamuda Gardens GL Lifestyle app. It demonstrates a
Node.js backend with a few API endpoints and sample data. The goal is to show
how volunteer hours can be recorded as "Care Credits" and redeemed for rewards.

## Features

- Log volunteer activities with `POST /logActivity`.
- Query a user's credit balance via `GET /userCredits?userId=<id>`.
- Redeem rewards with `POST /redeemReward`.
- List available rewards via `GET /availableRewards`.
- Minimal admin dashboard served from `/admin`.

## Running the demo

```bash
npm install
node server.js
```

This starts the server on port `3000`. The database is a simple JSON file
(`db.json`) managed with [lowdb](https://github.com/typicode/lowdb).

## Example API Usage

```bash
# Log an hour of volunteering for user 1
curl -X POST -H "Content-Type: application/json" \
  -d '{"userId":1,"description":"Park clean up","hours":1}' \
  http://localhost:3000/logActivity

# Get user credits
curl "http://localhost:3000/userCredits?userId=1"

# Redeem a reward
curl -X POST -H "Content-Type: application/json" \
  -d '{"userId":1,"rewardId":1}' \
  http://localhost:3000/redeemReward
```

## Files

- `server.js` – Express server with API routes.
- `db.json` – JSON database storing users, activities and rewards.
- `admin.html` – very small admin dashboard listing activities and users.
- `test.js` – basic tests for the API.

This demo is intentionally lightweight and meant for illustration purposes
only. For production use you would integrate with the real GL Lifestyle app's
authentication and database infrastructure.
