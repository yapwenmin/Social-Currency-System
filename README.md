# Social Currency System / Community Credits

This is a small demo implementation of a "Community Credits" module for a TimeBanking system in an existing app. 
It demonstrates a Node.js backend with a few API endpoints and sample data. 
The goal is to show how volunteer hours can be recorded as "Care Credits" and redeemed for rewards.

## Features

- Log volunteer activities with `POST /logActivity`.
- Query a user's credit balance via `GET /userCredits?userId=<id>`.
- Redeem rewards with `POST /redeemReward`.
- List available rewards via `GET /availableRewards`.
- Minimal admin dashboard served from `/admin`.
