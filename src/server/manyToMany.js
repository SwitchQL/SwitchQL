//create a new type:
//if the tables are author -> book -> genre

//create a new schema called book_genre type
//populate the fields with all the genre fields
//populate the fields with all the book fields removing the primary key
//rename any book fields that share a name with genre as book_(fieldname)
//set those as the proper fields within the type
//write a query for relatedGenres that returns a graphQLlist with book_genre type
//the query will specify SELECT genre.*, (insert each book field individually and their renamed aliases IF they were renamed), FROM authors left join books left join genre etc etc.
//use parent.id as the field to match on from authors
//write the same query with the logic flipped for the other direction
//potential downsides are that the amount of queries can get fairly large depending on how many foreign keys are shared
//upside is that this takes little processing power on the clientside and the developer gains more options to hit the database with