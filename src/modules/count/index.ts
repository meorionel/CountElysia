import { Elysia, t } from "elysia";
import { CountService } from "./service";
import { getCountModel } from "./model";

export const countController = new Elysia({ prefix: "/count" })
	.get("/:name", ({ params: { name } }) => CountService.getCount(name), {
		params: t.Object({
			name: t.String(),
		}),
		response: getCountModel,
		detail: { summary: "获取对应的计数器结果" },
	})
	.post("/:name", ({ params: { name } }) => CountService.addCount(name), {
        params: t.Object({
			name: t.String(),
		}),
		response: getCountModel,
		detail: { summary: "对应计算器自增并返回新的计数器结果" },
    });
