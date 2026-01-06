module.exports = {
	apps: [
		{
			name: "CountElysia",
			port: "4001",
			script: "./src/index.ts",
			interpreter: "/Users/aliceclodia/.bun/bin/bun",
			env_file: ".env",
		},
	],
};
