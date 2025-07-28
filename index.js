const axios = require('axios');
const readline = require('readline');
const { performance } = require('perf_hooks');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function main() {
  const users = parseInt(await ask('Number of users to simulate: '), 10);
  const method = (await ask('HTTP method (GET, POST, PUT, DELETE): ')).toUpperCase();
  const endpoint = await ask('API endpoint URL: ');
  const origin = await ask('Origin (leave blank for none): ');

  let fields = {};
  if (method === 'POST' || method === 'PUT') {
    const fieldCount = parseInt(await ask('How many fields in the body: '), 10);
    for (let i = 1; i <= fieldCount; i++) {
      const key = await ask(`Field ${i} name: `);
      const value = await ask(`Field ${i} value (use {i} for user index): `);
      fields[key] = value;
    }
  }

  console.log(`\nStarting test with ${users} users using ${method}...\n`);

  let rtoCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let durations = [];

  async function testUser(i) {
    const start = performance.now();
    
    const config = {
      method,
      url: endpoint,
      timeout: 5000,
      headers: {}
    };

    if (origin.trim()) {
      config.headers['Origin'] = origin.trim();
    }


    try {
      if (method === 'GET' || method === 'DELETE') {
        config.params = {};
      } else {
        const dynamicBody = {};
        for (const key in fields) {
          dynamicBody[key] = fields[key].replace('{i}', i);
        }
        config.data = dynamicBody;
      }

      const res = await axios(config);
      const duration = performance.now() - start;
      durations.push(duration);
      successCount++;
      console.log(`User ${i} - ✅ Status: ${res.status} - ⏱ ${duration.toFixed(2)}ms`);
    } catch (err) {
      const duration = performance.now() - start;
      durations.push(duration);

      if (err.code === 'ECONNABORTED') {
        console.log(`User ${i} - 🔥 RTO (timeout) - ⏱ ${duration.toFixed(2)}ms`);
        rtoCount++;
      } else {
        const status = err.response?.status || 'NO_RESPONSE';
        console.log(`User ${i} - ❌ ERROR (${status}) - ⏱ ${duration.toFixed(2)}ms`);
        errorCount++;
      }
    }
  }

  const concurrencyLimit = 1000;
  const tasks = [];
  for (let i = 1; i <= users; i++) {
    tasks.push(() => testUser(i));
  }

  async function runInBatches(batchSize) {
    const results = [];
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize).map(fn => fn());
      await Promise.all(batch);
      await sleep(10);
    }
    return results;
  }

  await runInBatches(concurrencyLimit);

  // Stats
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const min = Math.min(...durations);
  const max = Math.max(...durations);

  console.log(`\n=== 📊 Test Summary ===`);
  console.log(`Total Requests     : ${users}`);
  console.log(`✅ Success          : ${successCount}`);
  console.log(`❌ Errors           : ${errorCount}`);
  console.log(`🔥 RTOs             : ${rtoCount}`);
  console.log(`📈 Avg Response Time: ${avg.toFixed(2)}ms`);
  console.log(`📉 Min Response Time: ${min.toFixed(2)}ms`);
  console.log(`📈 Max Response Time: ${max.toFixed(2)}ms`);

  rl.close();
}

main();
