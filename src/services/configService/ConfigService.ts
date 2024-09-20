import * as dotenv from "dotenv";

dotenv.config();
const BASE_SERVER = process.env.BASE_SERVER || "";

class ConfigService {
  public async config(): Promise<any> {
    return {
      base: BASE_SERVER
    }
  }
}

export default new ConfigService();