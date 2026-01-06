import { Elysia, t } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { CountService } from "./service";
import { getCountModel } from "./model";

export const countController = new Elysia({ prefix: "/count" })
	.use(
		rateLimit({
			max: Number(process.env.GET_RATE_LIMIT_MAX || 10),
			duration: Number(process.env.GET_RATE_LIMIT_DURATION || 60_000),
			generator: (req) => {
				const url = new URL(req.url);
				return `${req.method}:${url.pathname}`;
			},
		})
	)
	.get("/:name", ({ params: { name } }) => CountService.getCount(name), {
		params: t.Object({
			name: t.String(),
		}),
		response: getCountModel,
		detail: { summary: "获取对应的计数器结果" },
	})

	.use(
		rateLimit({
			max: Number(process.env.POST_RATE_LIMIT_MAX || 1),
			duration: Number(process.env.POST_RATE_LIMIT_DURATION || 60_000),
			generator: (req) => {
				const url = new URL(req.url);
				return `${req.method}:${url.pathname}`;
			},
		})
	)
	.post("/:name", ({ params: { name } }) => CountService.addCount(name), {
		params: t.Object({
			name: t.String(),
		}),
		response: getCountModel,
		detail: { summary: "对应计算器自增并返回新的计数器结果" },
	});
