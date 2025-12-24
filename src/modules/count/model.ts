import { t } from "elysia";

export const getCountModel = t.Object({
	success: t.Boolean(),
	message: t.String(),
	data: t.Object({
		name: t.String(),
		count: t.Number(),
	}),
});
export type GetCount = typeof getCountModel.static;

export const addCountModel = t.Object({
	success: t.Boolean(),
	message: t.String(),
	data: t.Object({
		name: t.String(),
		count: t.Number(),
	}),
})
export type AddCount = typeof addCountModel.static;
