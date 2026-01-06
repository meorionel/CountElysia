const dotenv = require("dotenv");
const { parsed } = dotenv.config({ path: ".env" });

module.exports = {
	apps: [
		{
			name: "CountElysia",
			port: "4001",
			script: "./src/index.ts",
			interpreter: parsed?.BUN_BIN,
			env_file: ".env",
		},
	],
};
