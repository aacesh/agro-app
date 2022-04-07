import {SelectQueryBuilder, UpdateQueryBuilder, WithQueryBuilder} from "./query-builder"

export class QueryBuilderCreator {

  public static select(): SelectQueryBuilder {
    // TODO evaluate the tables directly from the database
    let builder = new SelectQueryBuilder()
    builder.queueQueryMeta = {
      selects: '*'
    }
    return builder
  }

  public static update(): UpdateQueryBuilder {
    // TODO evaluate the tables directly from the database
    let builder = new UpdateQueryBuilder()
    builder.queueQueryMeta = {}
    return builder
  }

  public static cte(): WithQueryBuilder {
    // TODO evaluate the tables directly from the database
    let builder = new WithQueryBuilder()
    builder.queueQueryMeta = {}
    return builder
  }
}

export type QueryTuple = [string, Array<any>]
