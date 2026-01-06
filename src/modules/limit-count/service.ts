import type { GetLimitCount, IncrementLimitCount } from "./model";
import { mysql } from "../../utils/db";

export const LimitCountService = {
	async getLimitCount(
		id: string,
		fingerprint?: string
	): Promise<GetLimitCount> {
		const result = await mysql`
            SELECT id, fingerprint FROM limit_count WHERE id = ${id}
        `;

		if (result.length === 0) {
			return {
				success: true,
				message: "Query success",
				data: {
					id,
					fingerprint: null,
					hasIncremented: false,
				},
			};
		}

		const record = result[0];
		const hasIncremented = fingerprint
			? record.fingerprint === fingerprint
			: !!record.fingerprint;

		return {
			success: true,
			message: "Query success",
			data: {
				id: record.id,
				fingerprint: record.fingerprint,
				hasIncremented,
			},
		};
	},

	async incrementLimitCount(
		id: string,
		fingerprint: string
	): Promise<IncrementLimitCount> {
		const existing = await mysql`
            SELECT id, fingerprint FROM limit_count WHERE id = ${id}
        `;

		if (existing.length > 0) {
			if (existing[0].fingerprint === fingerprint) {
				return {
					success: true,
					message: "Already incremented",
					data: {
						id,
						fingerprint,
					},
				};
			}

			if (existing[0].fingerprint !== null) {
				return {
					success: false,
					message: "This ID has already been incremented by another user",
					data: {
						id,
						fingerprint,
					},
				};
			}

			await mysql`
                UPDATE limit_count 
                SET fingerprint = ${fingerprint} 
                WHERE id = ${id}
            `;
		} else {
			await mysql`
                INSERT INTO limit_count (id, fingerprint) 
                VALUES (${id}, ${fingerprint})
            `;
		}

		return {
			success: true,
			message: "Increment success",
			data: {
				id,
				fingerprint,
			},
		};
	},
};
