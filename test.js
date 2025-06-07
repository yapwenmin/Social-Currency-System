const assert = require('assert');
// Node 18+ includes a global `fetch` implementation
const {spawn} = require('child_process');

let server;

async function start() {
  server = spawn('node', ['server.js'], {stdio: 'inherit'});
  await new Promise(r => setTimeout(r, 1500));
}

async function stop() {
  server.kill();
}

async function main() {
  await start();

  // Check user credits (should be 0)
  let res = await fetch('http://localhost:3000/userCredits?userId=1');
  let data = await res.json();
  assert.strictEqual(data.credits, 0);

  // Log activity
  res = await fetch('http://localhost:3000/logActivity', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({userId:1, description:'Test', hours:1})
  });
  data = await res.json();
  assert.ok(data.activity);

  // Approve activity
  res = await fetch('http://localhost:3000/admin/approve', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({activityId: data.activity.id})
  });
  await res.json();

  // Check credits again
  res = await fetch('http://localhost:3000/userCredits?userId=1');
  data = await res.json();
  assert.strictEqual(data.credits, 1);

  await stop();
  console.log('Tests passed');
}

main();
