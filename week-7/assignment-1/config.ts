import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

interface ENV {
  PORT: number | undefined;
  SECRET: string | undefined;
  MONGO_URI: string | undefined;
}

interface Config {
  SECRET: string;
  PORT: number;
  MONGO_URI: string;
}


const getConfig = (): ENV => {
  return {
    SECRET: process.env.SECRET ? String(process.env.SECRET) : undefined,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI ? String(process.env.MONGO_URI) : undefined
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
export default sanitizedConfig;

