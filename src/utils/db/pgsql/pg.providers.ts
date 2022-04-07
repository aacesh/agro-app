import {Logger} from "@nestjs/common";
import {Client, Pool, PoolClient, PoolConfig} from "pg";

import config from 'src/utils/config'
import {DBService} from "../dbservice.interface";

export class PgSqlService implements DBService<PoolClient> {

  private pool: Pool
  private poolClient: PoolClient

  constructor(readonly serviceName: string) {
    Logger.log("PgSqlService initialized:" + serviceName)
  }
  
  async init(): Promise<boolean> {
    // TODO check if healthy
    Logger.log(`initializing ${this.serviceName}`)
    if (this.pool) return true

    let pgConfig: PoolConfig = {
      host: config.db[this.serviceName].host,
      port:  config.db[this.serviceName].port,
      database: config.db[this.serviceName].database,
      user: config.db[this.serviceName].user,
      password: config.db[this.serviceName].password,
    //   connectionTimeoutMillis: config.db[this.serviceName].connect_timeout
    }
    console.log("pg config:", pgConfig)
    this.pool = new Pool(pgConfig);
    this.pool.on('connect', (client: PoolClient) => {
      Logger.log(`${this.serviceName} connected`)
      client.on('error', (err) => {
        Logger.log('Pool error')
        this.poolClient = undefined
        this.pool = undefined
      })
      // TODO check if pool is healthy by making a correct query for the given connecting user
    })

    this.pool.on('remove', (client: PoolClient) => {
      Logger.log(`${this.serviceName} has been disconnected. PoolClient removed`)
      this.poolClient = undefined
      this.pool = undefined
    })

    this.pool.on('error', (err) => {
      console.log("Error on connecting pgsql",err)
    })

    this.poolClient = await this.pool.connect()
    Logger.log("Pool created")
    return true
  }

  async connect(): Promise<PoolClient> {
    if (this.poolClient) {
      Logger.log('Ready connect')
      Logger.log(this.pool.totalCount)
      Logger.log(this.pool.idleCount)
      Logger.log(this.pool.waitingCount)
      // const connect = this.pool.connect
      Logger.log('got connect')
      return this.poolClient
    }

    return await this.init() ? this.poolClient : null
  }

}

