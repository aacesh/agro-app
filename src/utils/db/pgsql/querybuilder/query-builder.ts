import {size} from "lodash"
import {QueryBuildException} from "./query-builder.exception"

export abstract class QueryBuilder {
  public queueQueryMeta: {}  = {}

  public abstract build(): string
  public abstract buildQueryTuple(): [string, []]
}

// Select Query Builder

type JoinType = { table: string, condition: string }

export class SelectQueryBuilder extends QueryBuilder {

  public select(selects: string[] | string): SelectQueryBuilder {
    if (!selects || selects.length == 0) return this
    this.queueQueryMeta['selects'] = selects
    return this
  }

  public from(tableName: string): SelectQueryBuilder {
    this.queueQueryMeta['table'] = tableName
    return this
  }

  public join(joins: Array<JoinType>): SelectQueryBuilder {
    if (!joins || size(joins) == 0) return this
    this.queueQueryMeta['joins'] = joins
    return this
  }

  public limit(limits: number): SelectQueryBuilder {
    if (!limits) return this
    this.queueQueryMeta['limits'] = limits
    return this
  }

  public offset(offsets: number): SelectQueryBuilder {
    if (!offsets) return this
    this.queueQueryMeta['offsets'] = offsets
    return this
  }

  public sort(columnName: string, order: 0 | 1): SelectQueryBuilder {
    if (!columnName) return this
    this.queueQueryMeta['sorts'] = { columnName, order }
    return this
  }

  public groupBy(grouping: string | Array<string>): SelectQueryBuilder {
    if (!grouping) return this
    this.queueQueryMeta['groups'] = grouping
    return this
  }

  public orderBy(ordering: string): SelectQueryBuilder {
    if (!ordering) return this
    this.queueQueryMeta['orders'] = ordering
    return this
  }

  public where(wheres: Array<string> | object, mapTransformer?: (key: string, value: string) => string): SelectQueryBuilder {
    if (!wheres || size(wheres) == 0) return this
    if (typeof wheres === 'object') {
      // delete undefined properties only
      Object.keys(wheres).forEach(k => { if (wheres[k] === undefined) delete wheres[k] })

      // apply map transformer
      if (mapTransformer) {
        for (let o in wheres) wheres[o] = mapTransformer(o, wheres[o])
      }
    }
    this.queueQueryMeta['wheres'] = wheres
    return this
  }

  public returning(returns: Array<string>): SelectQueryBuilder {
    if (!returns || returns.length == 0) return this
    this.queueQueryMeta['returns'] = returns
    return this
  }

  public build(): string {
    if (!this.queueQueryMeta['table']) throw new QueryBuildException('table is not assigned in query')

    // SELECT
    let selectPart: string = ''
    const selects = this.queueQueryMeta['selects']
    if (selects) {
      if (typeof selects === 'string') selectPart = selects
      else selectPart = selects.join(',')
    }

    // TABLE
    let tablePart: string = this.queueQueryMeta['table']

    // JOIN
    let joinPart: string = ''
    const joins: Array<JoinType> = this.queueQueryMeta['joins']
    if (joins) {
      joinPart = joins.map(v => `${v.table} on ${v.condition}`).join(',')
    }

    // WHERE
    let wherePart: string = ''
    const wheres: Array<string> | object = this.queueQueryMeta['wheres']
    if (wheres) {
      if (Array.isArray(wheres)) {
        wherePart = wheres.join(' and ')
      } else {
        for (let i in wheres) wherePart += i + ' = ' + wheres[i] + ' and '
        wherePart = (wherePart.endsWith(' and ')? wherePart.slice(0, -5): wherePart)
      }
    }

    // LIMIT
    let limitPart: string = ''
    const limits: number = this.queueQueryMeta['limits']
    if (limits) {
      limitPart = `limit ${limits}`
    }

    // OFFSET
    let offsetPart = ''
    const offsets: number  = this.queueQueryMeta['offsets']
    if (offsets) {
      offsetPart = `offset ${offsets}`
    }

    // GROUP
    let groupPart = ''
    const groups = this.queueQueryMeta['groups']
    if (groups) {
      if (typeof groups === 'string') groupPart = `group by ${groups}`
      else groupPart = `group by ${groups.join(', ')}`
    }

    // ORDER
    let orderPart = ''
    const orders: any = this.queueQueryMeta['orders']
    if (orders) {
      orderPart = `order by ${orders.columnName} ${orders.order === 0? 'asc' : 'desc'} `
    }

    return `select ${selectPart} from ${tablePart} ${joinPart? 'join ' + joinPart: ''} ${wherePart? 'where ' + wherePart: ''} ${limitPart? limitPart: ''} ${offsetPart? offsetPart : ''} ${groupPart? groupPart : ''} ${orderPart? orderPart : ''}`
  }

  public buildQueryTuple(): [string, []] {
    return ['', []]
  }
}


// Update query builder


export class UpdateQueryBuilder extends QueryBuilder {

  public table(tableName: string): UpdateQueryBuilder {
    this.queueQueryMeta['table'] = tableName
    // console.log("queue query meta in table", this.queueQueryMeta)
    return this
  }

  // TODO possible to do category.id kind of thing with selection
  public setValues(values: object | string[]): UpdateQueryBuilder {
    if (!values || size(values) == 0) return this
    this.queueQueryMeta['sets'] = values
    console.log("queue query meta in set values", this.queueQueryMeta)
    return this
  }

  /**
   * @param(mapTransformer) transforms the key, value pair to string. Used when a custom transformation is required instead of (key = value)
   */
  public where(wheres: Array<string> | object, mapTransformer?: (key: string, value: string) => string): UpdateQueryBuilder {
    console.log("wheres:", wheres)
    if (!wheres || size(wheres) == 0) return this
    if (typeof wheres === 'object') {
      // delete undefined properties only
      Object.keys(wheres).forEach(k => { if (wheres[k] === undefined) delete wheres[k] })

      // apply map transformer
      if (mapTransformer) {
        for (let o in wheres) wheres[o] = mapTransformer(o, wheres[o])
      }
    }
    this.queueQueryMeta['wheres'] = wheres
    console.log("queue query meta in where", this.queueQueryMeta)
    return this
  }


  public returning(returns: Array<string> | string): UpdateQueryBuilder {
    if (!returns || size(returns) == 0) return this
    this.queueQueryMeta['returns'] = returns
    return this
  }

  public build(): string {
    if (!this.queueQueryMeta['table']) throw new QueryBuildException('table is not assigned in query')

    // SET
    let setPart: string = ''
    const sets: object | Array<string> = this.queueQueryMeta['sets']
    if (sets) {
      if (Array.isArray(sets)) {
        // console.log('isarray');
        setPart = (sets as Array<string>).join(',')
        // console.log(setPart)
      } else {
        // console.log('isobject');
        for (let k in sets) setPart += k + ' = ' + sets[k] + ','
        setPart = setPart.endsWith(',')? setPart.slice(0, -1): setPart
        // console.log(setPart);
      }
    }

    // TABLE
    let tablePart: string = this.queueQueryMeta['table']

    // WHERE
    let wherePart: string = ''
    const wheres: Array<string> | object = this.queueQueryMeta['wheres']
    if (wheres) {
      if (Array.isArray(wheres)) {
        wherePart = wheres.join(' and ')
      } else {
        for (let i in wheres) wherePart += i + ' = ' + wheres[i] + ' and '
        wherePart = (wherePart.endsWith(' and ')? wherePart.slice(0, -5): wherePart)
      }
    }
    // RETURNS
    let returnPart: string = ''
    const returns: Array<string> | string = this.queueQueryMeta['returns']
    if (returns) {
      returnPart = (Array.isArray(returns))? returns.join(',') : returns
    }

    return `update ${tablePart} set ${setPart} ${wherePart? 'where ' + wherePart: ''} ${returnPart? 'returning ' + returnPart : '' }`
  }

  public buildQueryTuple(): [string, []] {
    return ['', []]
  }
}


// CTE builder

export class WithQueryBuilder extends QueryBuilder {

  with(qb: SelectQueryBuilder, option: { alias: string }): WithQueryBuilder {
    if (!this.queueQueryMeta['withs']) this.queueQueryMeta['withs'] = []
    this.queueQueryMeta['withs'].push({ qb, option })
    return this
  }

  select(selectqb: SelectQueryBuilder): WithQueryBuilder {
    this.queueQueryMeta['selects'] = selectqb
    return this
  }

  public build(): string {
    // with part
    const withs = this.queueQueryMeta['withs']
    let withPart = ''
    for (const w of withs) {
      withPart += ` ${w['option']['alias']} as (${w['qb'].build()}),`
    }
    withPart = (withPart.endsWith(','))? withPart.slice(0, -1) : withPart

    // select part
    const selects = this.queueQueryMeta['selects']
    const selectPart = selects.build()

    return `with ${withPart} ${selectPart}`
  }

  public buildQueryTuple(): [string, []] {
    return ['', []]
  }
}
