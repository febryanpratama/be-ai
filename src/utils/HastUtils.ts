import { createHash } from "crypto";
import bcrypt from "bcrypt";


class HastUtils {

// Fungsi untuk membuat hash dari string menggunakan algoritma SHA-256
    public hashString(input: string): string {
        const hash = createHash("sha256");
        hash.update(input);
        return hash.digest("hex");
    }

    public async hashPassword( password : string ) : Promise<string> {
        return await bcrypt.hash( password, 8 );
    }

    public async comparePassword( password : string, hash : string ) : Promise<boolean> {
        return await bcrypt.compare( password, hash );
    }

}

export default new HastUtils();
