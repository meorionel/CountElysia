import { t } from "elysia";

export const limitCountParamsModel = t.Object({
	id: t.String({ format: "uuid", description: "计数器的唯一标识符" }),
});

export const limitCountBodyModel = t.Object({
	fingerprint: t.String({
		minLength: 32,
		maxLength: 32,
		description: "用户指纹，由 @fingerprintjs/fingerprintjs 生成",
	}),
});

export const limitCountQueryModel = t.Object({
	fingerprint: t.Optional(
		t.String({
			minLength: 32,
			maxLength: 32,
			description: "可选的用户指纹，用于查询特定用户的计数状态",
		})
	),
});

export const getLimitCountModel = t.Object({
	success: t.Boolean(),
	message: t.String(),
	data: t.Object({
		id: t.String(),
		fingerprint: t.Nullable(t.String()),
		hasIncremented: t.Boolean(),
	}),
});
export type GetLimitCount = typeof getLimitCountModel.static;

export const incrementLimitCountModel = t.Object({
	success: t.Boolean(),
	message: t.String(),
	data: t.Object({
		id: t.String(),
		fingerprint: t.String(),
	}),
});
export type IncrementLimitCount = typeof incrementLimitCountModel.static;
