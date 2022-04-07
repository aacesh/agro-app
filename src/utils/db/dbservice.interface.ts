export interface DBService<C> {
  init(): Promise<boolean>
  connect(): Promise<C>
}
