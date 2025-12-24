import { Elysia } from "elysia";
import { countController } from "./modules/count";

const app = new Elysia()
	.onError(({ code, error, set }) => {
		console.error(`[ERROR]${code}: error`);
		set.status = 500;
		return {
			success: false,
			message: "Internal Server Error",
		};
	})
	.group("/api", (app) => app.use(countController))
	.listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
