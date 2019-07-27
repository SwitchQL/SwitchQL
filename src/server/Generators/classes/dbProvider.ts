interface IDBProvider {
    connection(): void
    selectWithWhere(): void
    select(): void
    insert(): void
    update(): void
    delete(): void
    parameterize(): void
    configureExport(): void
}

export default IDBProvider