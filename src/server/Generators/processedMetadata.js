const formatted = {
  formattedMetaData: {
    tables: {
      '0': {
        type: 'author',
        fields: {
          '0': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: true,
            relation: {
              refTable: 2,
              refField: 3,
              refType: 'one to many'
            },
            tableNum: 0,
            fieldNum: 0
          },
          '1': {
            name: 'name',
            type: null,
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 0,
            fieldNum: 1
          }
        }
      },
      '1': {
        type: 'book_order',
        fields: {
          '0': {
            name: 'order_id',
            type: 'ID',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: true,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 1,
            fieldNum: 0
          },
          '1': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 1,
            fieldNum: 1
          },
          '2': {
            name: 'book_id',
            type: 'ID',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: true,
            relation: {
              refTable: 4,
              refField: 1,
              refType: 'many to one'
            },
            tableNum: 1,
            fieldNum: 2
          }
        }
      },
      '2': {
        type: 'books',
        fields: {
          '0': {
            name: 'publish_date',
            type: 'Date',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 2,
            fieldNum: 0
          },
          '1': {
            name: 'genre_id',
            type: 'ID',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: true,
            relation: {
              refTable: 3,
              refField: 1,
              refType: 'many to one'
            },
            tableNum: 2,
            fieldNum: 1
          },
          '2': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: true,
            relation: {
              refTable: 1,
              refField: 2,
              refType: 'one to many'
            },
            tableNum: 2,
            fieldNum: 2
          },
          '3': {
            name: 'author_id',
            type: 'ID',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: true,
            relation: {
              refTable: 0,
              refField: 0,
              refType: 'many to one'
            },
            tableNum: 2,
            fieldNum: 3
          },
          '4': {
            name: 'name',
            type: null,
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 2,
            fieldNum: 4
          }
        }
      },
      '3': {
        type: 'genre',
        fields: {
          '0': {
            name: 'name',
            type: null,
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 3,
            fieldNum: 0
          },
          '1': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: true,
            relation: {
              refTable: 2,
              refField: 1,
              refType: 'one to many'
            },
            tableNum: 3,
            fieldNum: 1
          }
        }
      },
      '4': {
        type: 'order',
        fields: {
          '0': {
            name: 'shipping_id',
            type: 'ID',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: true,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 4,
            fieldNum: 0
          },
          '1': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: true,
            relation: {
              refTable: 1,
              refField: 2,
              refType: 'one to many'
            },
            tableNum: 4,
            fieldNum: 1
          },
          '2': {
            name: 'user_id',
            type: 'ID',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: true,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 4,
            fieldNum: 2
          },
          '3': {
            name: 'status_id',
            type: 'ID',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: true,
            relation: {
              refTable: 7,
              refField: 1,
              refType: 'many to one'
            },
            tableNum: 4,
            fieldNum: 3
          },
          '4': {
            name: 'created_at',
            type: 'Date',
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 4,
            fieldNum: 4
          }
        }
      },
      '5': {
        type: 'shipping_method',
        fields: {
          '0': {
            name: 'method',
            type: null,
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 5,
            fieldNum: 0
          },
          '1': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: true,
            relation: {
              refTable: 4,
              refField: 3,
              refType: 'one to many'
            },
            tableNum: 5,
            fieldNum: 1
          }
        }
      },
      '6': {
        type: 'status',
        fields: {
          '0': {
            name: 'code',
            type: null,
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 6,
            fieldNum: 0
          },
          '1': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: true,
            relation: {
              refTable: 4,
              refField: 3,
              refType: 'one to many'
            },
            tableNum: 6,
            fieldNum: 1
          }
        }
      },
      '7': {
        type: 'user',
        fields: {
          '0': {
            name: 'name',
            type: null,
            primaryKey: false,
            unique: false,
            required: true,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 7,
            fieldNum: 0
          },
          '1': {
            name: 'id',
            type: 'ID',
            primaryKey: true,
            unique: false,
            required: true,
            inRelationship: true,
            relation: {
              refTable: 4,
              refField: 3,
              refType: 'one to many'
            },
            tableNum: 7,
            fieldNum: 1
          },
          '2': {
            name: 'address',
            type: null,
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 7,
            fieldNum: 2
          },
          '3': {
            name: 'phone_number',
            type: null,
            primaryKey: false,
            unique: false,
            required: false,
            inRelationship: false,
            relation: {
              refTable: null,
              refField: null,
              refType: null
            },
            tableNum: 7,
            fieldNum: 3
          }
        }
      }
    }
  }
};
