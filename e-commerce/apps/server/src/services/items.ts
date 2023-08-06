import fs from "node:fs/promises";
import { IItem } from "common";

export const findAll = async () => {
  try {
    const read = await fs.readFile("../book_details.json", "utf-8");
    const data: Array<IItem> = JSON.parse(read);
    return {
      statusCode: 200,
      body: data,
    };
  } catch (e) {
    console.log(e);
    return { statusCode: 500, body: [] };
  }
};
