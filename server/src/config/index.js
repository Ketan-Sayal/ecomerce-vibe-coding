import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    port: parseInt(new String(process.env.PORT).toString()),
    mongodbUri: new String(process.env.MONGODB_URI).toString()
}