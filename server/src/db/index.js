import mongoose from "mongoose";
import { config } from "../config/index.js";
import {DB_NAME} from "../constant.js";


export const DB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${config.mongodbUri}/${DB_NAME}`);
        console.log("\nMongodb connected\n");
        console.log(`Connection host: ${connectionInstance.connection.host}\n`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}