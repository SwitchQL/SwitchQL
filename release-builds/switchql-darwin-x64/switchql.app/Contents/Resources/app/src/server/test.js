const obj = {
  "dbMetaData": [{
    "table_name": "author",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "author",
    "column_name": "name",
    "is_nullable": "YES",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "book_order",
    "column_name": "order_id",
    "is_nullable": "YES",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "FOREIGN KEY",
    "foreign_table_name": "order",
    "foreign_column_name": "id"
  }, {
    "table_name": "book_order",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "book_order",
    "column_name": "book_id",
    "is_nullable": "YES",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "FOREIGN KEY",
    "foreign_table_name": "books",
    "foreign_column_name": "id"
  }, {
    "table_name": "books",
    "column_name": "publish_date",
    "is_nullable": "YES",
    "data_type": "date",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "books",
    "column_name": "genre_id",
    "is_nullable": "YES",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "FOREIGN KEY",
    "foreign_table_name": "genre",
    "foreign_column_name": "id"
  }, {
    "table_name": "books",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "books",
    "column_name": "author_id",
    "is_nullable": "YES",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "FOREIGN KEY",
    "foreign_table_name": "author",
    "foreign_column_name": "id"
  }, {
    "table_name": "books",
    "column_name": "name",
    "is_nullable": "YES",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "genre",
    "column_name": "name",
    "is_nullable": "YES",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "genre",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "order",
    "column_name": "shipping_id",
    "is_nullable": "YES",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "FOREIGN KEY",
    "foreign_table_name": "shipping_method",
    "foreign_column_name": "id"
  }, {
    "table_name": "order",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "order",
    "column_name": "user_id",
    "is_nullable": "YES",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "FOREIGN KEY",
    "foreign_table_name": "user",
    "foreign_column_name": "id"
  }, {
    "table_name": "order",
    "column_name": "status_id",
    "is_nullable": "YES",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "FOREIGN KEY",
    "foreign_table_name": "status",
    "foreign_column_name": "id"
  }, {
    "table_name": "order",
    "column_name": "created_at",
    "is_nullable": "YES",
    "data_type": "date",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "shipping_method",
    "column_name": "method",
    "is_nullable": "YES",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "shipping_method",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "status",
    "column_name": "code",
    "is_nullable": "YES",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "status",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "user",
    "column_name": "name",
    "is_nullable": "NO",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "user",
    "column_name": "id",
    "is_nullable": "NO",
    "data_type": "integer",
    "character_maximum_length": null,
    "constraint_type": "PRIMARY KEY",
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "user",
    "column_name": "address",
    "is_nullable": "YES",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }, {
    "table_name": "user",
    "column_name": "phone_number",
    "is_nullable": "YES",
    "data_type": "text",
    "character_maximum_length": null,
    "constraint_type": null,
    "foreign_table_name": null,
    "foreign_column_name": null
  }],
  "formattedMetaData": {
    "tables": {
      "0": {
        "type": "author",
        "fields": {
          "0": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": true,
            "relation": {
              "refTable": 2,
              "refField": 3,
              "refType": "one to many"
            },
            "tableNum": 0,
            "fieldNum": 0
          },
          "1": {
            "name": "name",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 0,
            "fieldNum": 1
          }
        }
      },
      "1": {
        "type": "book_order",
        "fields": {
          "0": {
            "name": "order_id",
            "type": "ID",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": true,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 1,
            "fieldNum": 0
          },
          "1": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 1,
            "fieldNum": 1
          },
          "2": {
            "name": "book_id",
            "type": "ID",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": true,
            "relation": {
              "refTable": 4,
              "refField": 1,
              "refType": "many to one"
            },
            "tableNum": 1,
            "fieldNum": 2
          }
        }
      },
      "2": {
        "type": "books",
        "fields": {
          "0": {
            "name": "publish_date",
            "type": "Date",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 2,
            "fieldNum": 0
          },
          "1": {
            "name": "genre_id",
            "type": "ID",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": true,
            "relation": {
              "refTable": 3,
              "refField": 1,
              "refType": "many to one"
            },
            "tableNum": 2,
            "fieldNum": 1
          },
          "2": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": true,
            "relation": {
              "refTable": 1,
              "refField": 2,
              "refType": "one to many"
            },
            "tableNum": 2,
            "fieldNum": 2
          },
          "3": {
            "name": "author_id",
            "type": "ID",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": true,
            "relation": {
              "refTable": 0,
              "refField": 0,
              "refType": "many to one"
            },
            "tableNum": 2,
            "fieldNum": 3
          },
          "4": {
            "name": "name",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 2,
            "fieldNum": 4
          }
        }
      },
      "3": {
        "type": "genre",
        "fields": {
          "0": {
            "name": "name",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 3,
            "fieldNum": 0
          },
          "1": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": true,
            "relation": {
              "refTable": 2,
              "refField": 1,
              "refType": "one to many"
            },
            "tableNum": 3,
            "fieldNum": 1
          }
        }
      },
      "4": {
        "type": "order",
        "fields": {
          "0": {
            "name": "shipping_id",
            "type": "ID",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": true,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 4,
            "fieldNum": 0
          },
          "1": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": true,
            "relation": {
              "refTable": 1,
              "refField": 2,
              "refType": "one to many"
            },
            "tableNum": 4,
            "fieldNum": 1
          },
          "2": {
            "name": "user_id",
            "type": "ID",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": true,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 4,
            "fieldNum": 2
          },
          "3": {
            "name": "status_id",
            "type": "ID",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": true,
            "relation": {
              "refTable": 7,
              "refField": 1,
              "refType": "many to one"
            },
            "tableNum": 4,
            "fieldNum": 3
          },
          "4": {
            "name": "created_at",
            "type": "Date",
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 4,
            "fieldNum": 4
          }
        }
      },
      "5": {
        "type": "shipping_method",
        "fields": {
          "0": {
            "name": "method",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 5,
            "fieldNum": 0
          },
          "1": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": true,
            "relation": {
              "refTable": 4,
              "refField": 3,
              "refType": "one to many"
            },
            "tableNum": 5,
            "fieldNum": 1
          }
        }
      },
      "6": {
        "type": "status",
        "fields": {
          "0": {
            "name": "code",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 6,
            "fieldNum": 0
          },
          "1": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": true,
            "relation": {
              "refTable": 4,
              "refField": 3,
              "refType": "one to many"
            },
            "tableNum": 6,
            "fieldNum": 1
          }
        }
      },
      "7": {
        "type": "user",
        "fields": {
          "0": {
            "name": "name",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": true,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 7,
            "fieldNum": 0
          },
          "1": {
            "name": "id",
            "type": "ID",
            "primaryKey": true,
            "unique": false,
            "required": true,
            "inRelationship": true,
            "relation": {
              "refTable": 4,
              "refField": 3,
              "refType": "one to many"
            },
            "tableNum": 7,
            "fieldNum": 1
          },
          "2": {
            "name": "address",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 7,
            "fieldNum": 2
          },
          "3": {
            "name": "phone_number",
            "type": null,
            "primaryKey": false,
            "unique": false,
            "required": false,
            "inRelationship": false,
            "relation": {
              "refTable": null,
              "refField": null,
              "refType": null
            },
            "tableNum": 7,
            "fieldNum": 3
          }
        }
      }
    }
  }
}