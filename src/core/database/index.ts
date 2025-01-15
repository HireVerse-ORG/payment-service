import { connectDb, disConnectDb } from "./postgress";

export default class Database {

    async connect(): Promise<void> {
        await connectDb()
    }

    async disconnect(): Promise<void> {
        await disConnectDb()
    }
}