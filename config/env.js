import { config } from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}.local`;

config({ path: envFile });

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN ,ARCJET_KEY, ARCJET_ENV } =
  process.env;
