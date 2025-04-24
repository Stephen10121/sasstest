import { config } from "dotenv";

config();

export const authorizedOrigins: string[] = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];