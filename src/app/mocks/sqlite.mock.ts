export class SQLiteMock {
  create(config: any): Promise<any> {
    return Promise.resolve({
      executeSql: (query: string, params?: any[]) =>
        Promise.resolve({ rows: { length: 0, item: () => null } }),
      transaction: (fn: any) => Promise.resolve(fn({ executeSql: () => {} })),
      close: () => Promise.resolve(),
    });
  }
}
