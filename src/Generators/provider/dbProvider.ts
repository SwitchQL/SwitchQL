interface DBProvider {
    connection(): void;
    selectWithWhere(table: string, col: string, val: string, returnsMany: boolean): void;
    select(table: string): void;
    insert(table: string, cols: string, args: string): void;
    update(table: string, idColumnName: string): void;
    delete(table: string, column: string): void;
    parameterize(): void;
    configureExport(): void;
}

export default DBProvider
