import {Logger} from "@nestjs/common"
import { json } from "stream/consumers";
const path = require('path');
import {getEnvFile} from "../misc/env"

let envfile = getEnvFile()

Logger.log(`Selected .env file: ${envfile}`)

const envPath= path.resolve(process.cwd(), envfile)

console.log("path:", envPath)
const dotenv = require('dotenv').config({ path: envPath})
// console.log("dotenv:", dotenv)
let config = require('config')
// config= JSON.stringify(config)
// console.log(JSON.parse(config))
export { dotenv }
export default config
