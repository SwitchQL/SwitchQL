# <center>Refactoring Thoughts</center>

- You can remove the comments in the buildGraphqlTypeSchema method, they don't give you any information that reading the code wouldn't. Comments should only be used to explain something that the reader might not understand just by reading the code. Think of comments as code metadata.

- I don't think it's necessary to include graph ql in all of the function names, we know we're working with graph ql. If you can infer something from the context you don't need to state it explicitly

- I would use a for of loop instead of a for in loop on line 74, that way you don't have to constantlym index into the object and it's a little cleaner. This is also good advice for me and something I'll implement in the mutation generator and the metadataProcessor. Something like this:

  ```javascript
  for (let column of Object.values(columns)) {
    typeQuery += `\n${tab}${tab}${
      column.name
    }: { type: ${tableDataTypeToGraphqlType(column.type)} }`;
  }
  ```

- formatTypeName can be pulled into a utils file and should be changed to toTitleCase like it is in the rest of the application

- Unnecessary db provider if check on line 142

- line 143 SELECT \* should never be used to select from a table in a production scenario. What if a column gets added that isn't supposed to be selected? better to get the column names explicitly, they can always regenerate the schema if they need to update the database

- Unnecessary object connect in generated code, just use the connection directly why bother to wrap it in a variable?

- Unnecessary many to many checks, remove them until many to many is actually implemented

- Line 158 I'm undecided as to whether there should be any catch statements in the generated pgp promise methods, just returning errors will leak protected data to the clients, better to just let the implementors do it themselves.

- Line 211 see comment on line 143 and comment on line 158 in this document, remove the postgres checks

- Line 195 You can do something like this instead, it's cleaner:

```javascript
Object.values(column).find(c => c.primaryKey);
```

- Line 211 see comment on line 143 and comment on line 158 in this document, also we've seen the same block of sql generation code 3 times already. Pull it out into a seperate method, also again remove the postgres checks:

```javascript
if (dbProvider === "PostgreSQL") {
  rootQuery += `const sql = \`SELECT * FROM "${tableName}" WHERE "${
    idColumn.name
  }" = \${args.${idColumn.name}}\`;\n`;
  rootQuery += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
  rootQuery += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
  rootQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
  rootQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
  rootQuery += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
  rootQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err)\n`;
  rootQuery += `${tab}${tab}${tab}${tab}${tab}})`;
}
```

- Replace hard coded sql strings with database variables in createFindByIdQuery eg:

```javascript
     if (dbProvider === "PostgreSQL") {
    rootQuery += `const sql = \`SELECT * FROM "${tableName}" WHERE "${
      idColumn.name
    }" = $1`;\n`;

    return connect.conn.one(sql, args.${idColumn.name})
```

- Theres two buildMutationArgType functions in the file, one of which is nested in the addMutation function. Delete the nested function

- In the addMutation, updateMutation and deleteMutation functions replace hard coded sql strings with database variables

- Line 289 remove postgres check

- I would create a different file that has methods for all of the sql generation which will be shared by all the sql providers, it should just return teh sql statements though cause remember the connection interfaces could be different

- The checkifColumnRequired nethod is kind of Unnecessary I would just replace it with a simple ternary, something like this:

```javascript
column.required
  ? (mutationQuery += `new GraphQLNonNull(${column.type})`)
  : (mutationQuery += column.type);
```

- I would make a tab function that takes the amount of tabs you want to insert that way you don't have a million \${tab} statements everywhere, something like this:

```javascript
function tab(tabNum) {
  const i = tabNum;
  let tabs = "";

  while (i--) {
    tabs += tab;
  }

  return tabs;
}
```
