import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { countController } from "./modules/count/index";
import { limitCountController } from "./modules/limit-count/index";

const app = new Elysia()
	.onError(({ code, error, set }) => {
		console.error(`[ERROR]${code}:`, error);
		if (code === "VALIDATION") {
			set.status = 400;
			return {
				success: false,
				message: "Validation Error",
				detail: error,
			};
		}
		set.status = 500;
		return {
			success: false,
			message: "Internal Server Error",
		};
	})
	.get("/", () => {
		return new Response(Bun.file("docs/api-en.html"), {
			headers: {
				"Content-Type": "text/html; charset=utf-8",
			},
		});
	})
	.get("/zh", () => {
		return new Response(Bun.file("docs/api-zh.html"), {
			headers: {
				"Content-Type": "text/html; charset=utf-8",
			},
		});
	})
	.use(
		staticPlugin({
			prefix: "/docs",
			assets: "docs",
		})
	)
	.group("/api", (app) =>
		app.use(countController).use(limitCountController)
	)
	.listen(process.env.APP_PORT || 3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
