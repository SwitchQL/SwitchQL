interface DBMetadata {
    tableName: string;
    columnName: string;
    isNullable: string;
    dataType: string;
    characterMaximumLength: string;
    constraintType: string;
    foreignTableName: string;
    foreignColumnName: string;
}

export default DBMetadata