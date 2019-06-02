function pgSQL(type) {
  switch (type) {
    case "integer":
      return "Integer";

    case "double precision":
    case "real":
      return "Float";

    case "boolean":
      return "Boolean";

    case "date":
      return "Date";

    case "time":
      return "Time";

    case "timestamp":
      return "DateTime";

    default:
      return "String";
  }
}

function msSQL(type) {
  switch (type) {
    case "bigint":
    case "bit":
    case "int":
    case "smallint":
      return "Integer";

    case "decimal":
    case "money":
    case "numeric":
    case "smallmoney":
    case "float":
    case "real":
      return "Float";

    case "date":
      return "Date";

    case "time":
      return "Time";

    case "datetime2":
    case "datetime":
    case "datetimeoffset":
    case "smalldatetime":
      return "DateTime";

    case "char":
    case "varchar":
    case "text":
    case "nchar":
    case "nvarchar":
    case "ntext":
    case "binary":
    case "image":
    case "varbinary":
      return "String";

    default:
      return "String";
  }
}

module.exports = { pgSQL, msSQL };
