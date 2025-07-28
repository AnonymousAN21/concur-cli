
# 🧪 Concurrent API Load Tester (CLI)

A simple and customizable **CLI tool** to simulate concurrent user requests to an API endpoint using `axios` and `Node.js`. Supports multiple HTTP methods, dynamic request bodies, request timeout detection, and performance summary stats.

---

## 📦 Features

- Simulate **concurrent API requests** (`GET`, `POST`, `PUT`, `DELETE`)
- Customizable **request body fields**
- Dynamic values per user (`{i}` placeholder)
- Detects and logs **RTOs** (Request Timeouts)
- Prints **per-user results**
- Provides **summary statistics**:
  - ✅ Success count
  - ❌ Error count
  - 🔥 Timeout (RTO) count
  - 📈 Average / Min / Max response time

---

## 🚀 Getting Started

### 1. Clone or copy the script

Save the script as `loadtest.js`.

### 2. Install dependencies

```bash
npm install axios
````

---

## 🧪 Usage

Run the script using Node.js:

```bash
node loadtest.js
```

### CLI Prompts

You'll be asked the following:

```
Number of users to simulate:
HTTP method (GET, POST, PUT, DELETE):
API endpoint URL:
Origin (leave blank for none):
```

If you select `POST` or `PUT`, you'll also define the request body:

```
How many fields in the body: 2
Field 1 name: username
Field 1 value (use {i} for user index): user{i}
Field 2 name: password
Field 2 value (use {i} for user index): pass123
```

---

## 📊 Example Output

```
Starting test with 100 users using POST...

User 1 - ✅ Status: 200 - ⏱ 132.49ms
User 2 - 🔥 RTO (timeout) - ⏱ 5002.33ms
User 3 - ❌ ERROR (500) - ⏱ 155.12ms
...

=== 📊 Test Summary ===
Total Requests     : 100
✅ Success          : 95
❌ Errors           : 3
🔥 RTOs             : 2
📈 Avg Response Time: 231.78ms
📉 Min Response Time: 114.23ms
📈 Max Response Time: 5002.33ms
```

---

## ⚙️ Configuration

* **Timeout**: 5 seconds (`timeout: 5000` in Axios config)
* **Concurrency limit**: 1000 by default (all users fire in one batch)
* **Batch delay**: 10ms between batches (customizable)

You can tweak these in the script:

```js
const concurrencyLimit = 1000;
await sleep(10);
```

---

## 📌 Tips

* For stress testing APIs, start with 10, 100, 500 users — then increase gradually.
* Use `{i}` in field values to generate dynamic usernames like `user1`, `user2`, etc.
* You can pipe results into a log file:

```bash
node loadtest.js > result.log
```

---

## 🧠 Future Ideas

* Export summary as CSV
* Chart visualization
* Token/header auth support
* Config file input

---

## 📄 License

MIT License

```
