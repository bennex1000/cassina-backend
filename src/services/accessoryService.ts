import { db } from "../database.js";
import { Accessory, Result } from "../types";

export const getAllAccessories = async (): Promise<Result<Accessory[]>> => {
  try {
    const { rows } = await db.query<Accessory>(
      `
    SELECT * FROM accessories;
`,
    );
    return { ok: true, data: rows };
  } catch (error) {
    return { ok: false, error };
  }
};

export default { getAllAccessories };
