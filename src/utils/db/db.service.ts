import { Injectable, Logger, NotImplementedException } from "@nestjs/common";
import { PoolClient } from "pg";
import { PgSqlService } from "./pgsql/pg.providers";
import config from "../config";
import { DBService } from "./dbservice.interface";
import { DB } from "src/db_helper/db.types.enum";

export type DataConnectionService = {
    [key: string]: string
}

@Injectable()
export class DataService {
    providers = {}
    pgClient : PoolClient
    constructor(readonly connections: DataConnectionService) {
        Logger.log("Starting database service")
        if (config.db.init_db) {
            Logger.log("Initializing database service")
            this.init(connections)
        }  
    }

    private async init(connections: DataConnectionService) {
        // eventually the database connection will have to be initialized immediately
        for (let conn in connections) {
            switch (conn) {
                case "postgres":
                    Logger.log("conn is postgres")
                    this.initPgSql(connections[conn])
                    break
                case "redis":
                    throw new NotImplementedException("Redis connection constraint not implemented")
            }

        }

    }

    private async initPgSql(name: string) {
        console.log("Init pgsql")
        this.providers[name] = new PgSqlService(name)
        let init_immediate = config.db[name].init_immediate
        console.log("init_immediate;", init_immediate)
        if (config.db[name].init_immediate) {
            console.log("Initilizing postgres sql")
            const conn = await (this.providers[name] as DBService<PoolClient>).init()
            if (conn === null) {
                throw new Error(`Connection error with db:${name}`)
            }
            this.pgClient= await (this.providers[DB.PG] as DBService<any>).connect()
        }
    }

    public async connect<T>(connName: string) {
        // TODO move the names to enum
        console.log('connect to ' + connName)
        switch (connName) {
            case DB.PG:
                if (!this.providers[DB.PG]) {
                    await this.initPgSql(DB.PG)
                }
                return (this.providers[DB.PG] as DBService<T>).connect()

            case "red01":
                throw new NotImplementedException()
        }
    }

}
