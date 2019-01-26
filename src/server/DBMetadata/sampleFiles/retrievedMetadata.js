export default [
  {
    table_name: "author",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "author",
    column_name: "name",
    is_nullable: "YES",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "book_order",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "book_order",
    column_name: "book_id",
    is_nullable: "YES",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "FOREIGN KEY",
    foreign_table_name: "books",
    foreign_column_name: "id"
  },
  {
    table_name: "book_order",
    column_name: "order_id",
    is_nullable: "YES",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "FOREIGN KEY",
    foreign_table_name: "order",
    foreign_column_name: "id"
  },
  {
    table_name: "books",
    column_name: "genre_id",
    is_nullable: "YES",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "FOREIGN KEY",
    foreign_table_name: "genre",
    foreign_column_name: "id"
  },
  {
    table_name: "books",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "books",
    column_name: "test",
    is_nullable: "YES",
    data_type: "double precision",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "books",
    column_name: "name",
    is_nullable: "YES",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "books",
    column_name: "publish_date",
    is_nullable: "YES",
    data_type: "date",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "books",
    column_name: "author_id",
    is_nullable: "YES",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "FOREIGN KEY",
    foreign_table_name: "author",
    foreign_column_name: "id"
  },
  {
    table_name: "genre",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "genre",
    column_name: "name",
    is_nullable: "YES",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "order",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "order",
    column_name: "created_at",
    is_nullable: "YES",
    data_type: "date",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "order",
    column_name: "user_id",
    is_nullable: "YES",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "FOREIGN KEY",
    foreign_table_name: "user",
    foreign_column_name: "id"
  },
  {
    table_name: "order",
    column_name: "status_id",
    is_nullable: "YES",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "FOREIGN KEY",
    foreign_table_name: "status",
    foreign_column_name: "id"
  },
  {
    table_name: "order",
    column_name: "shipping_id",
    is_nullable: "YES",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "FOREIGN KEY",
    foreign_table_name: "shipping_method",
    foreign_column_name: "id"
  },
  {
    table_name: "shipping_method",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "shipping_method",
    column_name: "method",
    is_nullable: "YES",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "status",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "status",
    column_name: "code",
    is_nullable: "YES",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "user",
    column_name: "id",
    is_nullable: "NO",
    data_type: "integer",
    character_maximum_length: null,
    constraint_type: "PRIMARY KEY",
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "user",
    column_name: "phone_number",
    is_nullable: "YES",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "user",
    column_name: "address",
    is_nullable: "YES",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  },
  {
    table_name: "user",
    column_name: "name",
    is_nullable: "NO",
    data_type: "text",
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null
  }
];
