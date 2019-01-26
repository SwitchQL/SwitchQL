export default {
  tables: {
    "0": {
      type: "author",
      fields: {
        "0": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: true,
          relation: {
            "2.5": { refTable: 2, refField: 5, refType: "one to many" }
          },
          tableNum: 0,
          fieldNum: 0
        },
        "1": {
          name: "name",
          type: "String",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 0,
          fieldNum: 1
        }
      }
    },
    "1": {
      type: "book_order",
      fields: {
        "0": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: false,
          relation: {},
          tableNum: 1,
          fieldNum: 0
        },
        "1": {
          name: "book_id",
          type: "ID",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: true,
          relation: {
            "2.1": { refTable: 2, refField: 1, refType: "many to one" }
          },
          tableNum: 1,
          fieldNum: 1
        },
        "2": {
          name: "order_id",
          type: "ID",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: true,
          relation: {
            "4.0": { refTable: 4, refField: 0, refType: "many to one" }
          },
          tableNum: 1,
          fieldNum: 2
        }
      }
    },
    "2": {
      type: "books",
      fields: {
        "0": {
          name: "genre_id",
          type: "ID",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: true,
          relation: {
            "3.0": { refTable: 3, refField: 0, refType: "many to one" }
          },
          tableNum: 2,
          fieldNum: 0
        },
        "1": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: true,
          relation: {
            "1.1": { refTable: 1, refField: 1, refType: "one to many" }
          },
          tableNum: 2,
          fieldNum: 1
        },
        "2": {
          name: "test",
          type: "Float",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 2,
          fieldNum: 2
        },
        "3": {
          name: "name",
          type: "String",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 2,
          fieldNum: 3
        },
        "4": {
          name: "publish_date",
          type: "Date",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 2,
          fieldNum: 4
        },
        "5": {
          name: "author_id",
          type: "ID",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: true,
          relation: {
            "0.0": { refTable: 0, refField: 0, refType: "many to one" }
          },
          tableNum: 2,
          fieldNum: 5
        }
      }
    },
    "3": {
      type: "genre",
      fields: {
        "0": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: true,
          relation: {
            "2.0": { refTable: 2, refField: 0, refType: "one to many" }
          },
          tableNum: 3,
          fieldNum: 0
        },
        "1": {
          name: "name",
          type: "String",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 3,
          fieldNum: 1
        }
      }
    },
    "4": {
      type: "order",
      fields: {
        "0": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: true,
          relation: {
            "1.2": { refTable: 1, refField: 2, refType: "one to many" }
          },
          tableNum: 4,
          fieldNum: 0
        },
        "1": {
          name: "created_at",
          type: "Date",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 4,
          fieldNum: 1
        },
        "2": {
          name: "user_id",
          type: "ID",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: true,
          relation: {
            "7.0": { refTable: 7, refField: 0, refType: "many to one" }
          },
          tableNum: 4,
          fieldNum: 2
        },
        "3": {
          name: "status_id",
          type: "ID",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: true,
          relation: {
            "6.0": { refTable: 6, refField: 0, refType: "many to one" }
          },
          tableNum: 4,
          fieldNum: 3
        },
        "4": {
          name: "shipping_id",
          type: "ID",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: true,
          relation: {
            "5.0": { refTable: 5, refField: 0, refType: "many to one" }
          },
          tableNum: 4,
          fieldNum: 4
        }
      }
    },
    "5": {
      type: "shipping_method",
      fields: {
        "0": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: true,
          relation: {
            "4.4": { refTable: 4, refField: 4, refType: "one to many" }
          },
          tableNum: 5,
          fieldNum: 0
        },
        "1": {
          name: "method",
          type: "String",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 5,
          fieldNum: 1
        }
      }
    },
    "6": {
      type: "status",
      fields: {
        "0": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: true,
          relation: {
            "4.3": { refTable: 4, refField: 3, refType: "one to many" }
          },
          tableNum: 6,
          fieldNum: 0
        },
        "1": {
          name: "code",
          type: "String",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 6,
          fieldNum: 1
        }
      }
    },
    "7": {
      type: "user",
      fields: {
        "0": {
          name: "id",
          type: "ID",
          primaryKey: true,
          unique: false,
          required: true,
          inRelationship: true,
          relation: {
            "4.2": { refTable: 4, refField: 2, refType: "one to many" }
          },
          tableNum: 7,
          fieldNum: 0
        },
        "1": {
          name: "phone_number",
          type: "String",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 7,
          fieldNum: 1
        },
        "2": {
          name: "address",
          type: "String",
          primaryKey: false,
          unique: false,
          required: false,
          inRelationship: false,
          relation: {},
          tableNum: 7,
          fieldNum: 2
        },
        "3": {
          name: "name",
          type: "String",
          primaryKey: false,
          unique: false,
          required: true,
          inRelationship: false,
          relation: {},
          tableNum: 7,
          fieldNum: 3
        }
      }
    }
  }
};
