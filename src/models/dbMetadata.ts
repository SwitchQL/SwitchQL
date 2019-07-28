interface DBMetadata {
    table_name: string
    column_name: string
    is_nullable: string
    data_type: string
    character_maximum_length: string
    constraint_type: string
    foreign_table_name: string
    foreign_column_name: string
}

export default DBMetadata