import type { AddCount, GetCount } from "./model";
import { mysql } from "../../utils/db";

export const CountService = {
	async getCount(name: string): Promise<GetCount> {
		await mysql`
            INSERT IGNORE INTO count (name, count) VALUES (${name}, 0)
        `;
		const result = await mysql`SELECT name, count FROM count WHERE name = ${name}`;
		return {
			success: true,
			message: "Query success",
			data: result[0],
		};
	},
	async addCount(name: string): Promise<AddCount> {
		await mysql`
            INSERT INTO count (name, count)
            VALUES (${name}, 1)
            ON DUPLICATE KEY UPDATE count = count + 1
        `;
		const result = await mysql`
            SELECT name, count FROM count WHERE name = ${name}
        `;
		return {
			success: true,
			message: "Update success",
			data: result[0],
		};
	},
};
