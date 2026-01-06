import http from "http";

const BASE_URL = process.env.API_URL || "http://localhost:4001";

const TEST_CONFIG = {
	GET: {
		total: 20,
		intervalMs: 50,
	},
	POST: {
		total: 20,
		intervalMs: 50,
	},
	RETRY_DELAY_MS: 2000,
};

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function request({ method, path }) {
	return new Promise((resolve) => {
		const start = Date.now();
		const url = new URL(BASE_URL);

		const req = http.request(
			{
				hostname: url.hostname,
				port: url.port,
				path,
				method,
			},
			(res) => {
				let body = "";
				res.on("data", (c) => (body += c));
				res.on("end", () => {
					resolve({
						status: res.statusCode,
						elapsed: Date.now() - start,
						retryAfter: res.headers["retry-after"],
						body,
					});
				});
			}
		);

		req.on("error", (e) => resolve({ status: 0, elapsed: Date.now() - start, error: e.message }));

		req.end();
	});
}

async function runTest(method, config) {
	console.log(`\n=== ${method} 测试开始 ===`);

	const results = [];

	for (let i = 0; i < config.total; i++) {
		results.push(
			request({
				method,
				path: `/api/count/test-${method.toLowerCase()}`,
			})
		);
		await sleep(config.intervalMs);
	}

	const data = await Promise.all(results);

	const summary = {
		ok: 0,
		rateLimited: 0,
		error: 0,
		totalTime: 0,
	};

	data.forEach((r, i) => {
		summary.totalTime += r.elapsed;

		if (r.status === 200) summary.ok++;
		else if (r.status === 429) summary.rateLimited++;
		else summary.error++;

		console.log(`#${i + 1} ${method} → ${r.status} (${r.elapsed}ms)${r.retryAfter ? ` retry-after=${r.retryAfter}` : ""}`);
	});

	console.log(`--- ${method} 统计 ---`);
	console.log(`成功: ${summary.ok}`);
	console.log(`被限流: ${summary.rateLimited}`);
	console.log(`异常: ${summary.error}`);
	console.log(`平均耗时: ${(summary.totalTime / data.length).toFixed(1)}ms`);
}

console.log("=== Rate Limit 测试开始 ===");

await runTest("GET", TEST_CONFIG.GET);
await runTest("POST", TEST_CONFIG.POST);

console.log(`\n等待 ${TEST_CONFIG.RETRY_DELAY_MS / 1000}s 观察窗口恢复...\n`);
await sleep(TEST_CONFIG.RETRY_DELAY_MS);

const restore = await request({
	method: "POST",
	path: "/api/count/test-post",
});

console.log(`恢复测试 POST → ${restore.status} (${restore.elapsed}ms)`);

console.log("\n=== 测试结束 ===");
