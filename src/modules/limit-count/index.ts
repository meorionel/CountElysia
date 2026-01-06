import { Elysia, t } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { LimitCountService } from "./service";
import {
	limitCountParamsModel,
	limitCountBodyModel,
	limitCountQueryModel,
	getLimitCountModel,
	incrementLimitCountModel,
} from "./model";

export const limitCountController = new Elysia({
	prefix: "/limit-count",
})
	.get(
		"/:id",
		({ params: { id }, query: { fingerprint } }) =>
			LimitCountService.getLimitCount(id, fingerprint),
		{
			params: limitCountParamsModel,
			query: limitCountQueryModel,
			response: getLimitCountModel,
			detail: { summary: "查询限制计数状态" },
		}
	)
	.use(
		rateLimit({
			max: Number(process.env.LIMIT_COUNT_RATE_LIMIT_MAX || 5),
			duration: Number(
				process.env.LIMIT_COUNT_RATE_LIMIT_DURATION || 60_000
			),
			generator: (req) => {
				const url = new URL(req.url);
				return `${req.method}:${url.pathname}`;
			},
		})
	)
	.post(
		"/:id",
		({ params: { id }, body: { fingerprint } }) =>
			LimitCountService.incrementLimitCount(id, fingerprint),
		{
			params: limitCountParamsModel,
			body: limitCountBodyModel,
			response: incrementLimitCountModel,
			detail: { summary: "限制计数自增" },
		}
	);
